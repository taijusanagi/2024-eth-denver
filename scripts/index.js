const fs = require("fs");
const os = require("os");
const path = require("path");
const util = require("util");
const { EthStorage } = require("ethstorage-sdk");
const { ethers } = require("ethers");

const writeFileAsync = util.promisify(fs.writeFile);

const deployedSepoliaBlobDirectory = "0x53E2e6379a5697f09C8Eedd4fE05Da4f9A977269";
const deployedSepoliaNormalDirectory = "0x0eb32D2424B048120043A35489CC5913C2d50108";
const createdBlobFileName = "1709122873485.txt";
const createdNormalFileName = "1708998813573.txt";

const IERC5018Abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "write",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
    ],
    name: "read",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// this function only called for setup
async function setupBlobDirectory() {
  const privateKey = process.env.PRIVATE_KEY;
  const rpc = "https://gateway.tenderly.co/public/sepolia";
  const ethStorage = new EthStorage(rpc, privateKey);
  // this method uses below as blob manager
  // https://sepolia.etherscan.io/address/0x804C520d3c084C805E37A35E90057Ac32831F96f
  const result = await ethStorage.deploySepoliaDirectory();
  console.log(result);
}

// this function only called for setup
async function setupNormalDirectory() {
  const privateKey = process.env.PRIVATE_KEY;
  const rpc = "https://gateway.tenderly.co/public/sepolia";
  const ethStorage = new EthStorage(rpc, privateKey);
  // this method uses empty address as blob manager
  const result = await ethStorage.deployNormalDirectory();
  console.log(result);
}

// success tx
// 0xfcdc34a1a9be6a0fca22b23d0a901d74608f5df55757d9317f44e630ea0a504c
// https://sepolia.etherscan.io/tx/0xfcdc34a1a9be6a0fca22b23d0a901d74608f5df55757d9317f44e630ea0a504c

async function uploadToBlobDirectory() {
  const privateKey = process.env.PRIVATE_KEY;
  // should use rpc which suports blob upload
  const rpc = process.env.RPC;
  const ethStorage = new EthStorage(rpc, privateKey, deployedSepoliaBlobDirectory);
  const originalBuffer = fs.readFileSync("./test.txt"); // This is your original buffer
  const modifiedString = originalBuffer.toString("utf-8") + " ".repeat(2000); // Convert buffer to string and append spaces
  const content = Buffer.from(modifiedString, "utf-8");

  // console.log(content.length);
  // return;

  // Create a temporary file path
  const tempDir = os.tmpdir();
  const fileName = `${Date.now()}.txt`;
  console.log("fileName", fileName);
  const tempFilePath = path.join(tempDir, fileName);

  // Write the content to the temporary file
  await writeFileAsync(tempFilePath, content);

  try {
    // Upload the file using its path
    await ethStorage.upload(tempFilePath);
  } finally {
    // Clean up: Delete the temporary file after upload
    fs.unlink(tempFilePath, (err) => {
      if (err) console.error("Error removing temporary file:", err);
    });
  }
}

async function uploadToNormalDirectory() {
  const privateKey = process.env.PRIVATE_KEY;
  const rpc = "https://gateway.tenderly.co/public/sepolia";
  // const ethStorage = new EthStorage(rpc, privateKey, deployedSepoliaDirectory);
  const content = "hello world!!";
  const contentBytes = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(content));

  // Create a temporary file path
  const fileName = `${Date.now()}.txt`;
  console.log("fileName", fileName);
  const fileNameBytes = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(fileName));

  // const provider = new ethers.providers.JsonRpcProvider(process.env.RPC);
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(privateKey, provider);
  // const contract = new ethers.Contract(deployedSepoliaDirectory, IERC5018Abi, provider);
  const contract = new ethers.Contract(deployedSepoliaNormalDirectory, IERC5018Abi, wallet);
  const result = await contract.write(fileNameBytes, contentBytes);
  console.log(result.hash);
  await result.wait();
  console.log("confirmed");
}

async function readFromBlobDirectory() {
  // const provider = new ethers.providers.JsonRpcProvider(process.env.RPC);
  const provider = new ethers.providers.JsonRpcProvider("http://65.108.236.27:9540");
  // const contract = new ethers.Contract(deployedSepoliaDirectory, IERC5018Abi, provider);
  const contract = new ethers.Contract(deployedSepoliaBlobDirectory, IERC5018Abi, provider);
  const [data] = await contract.read(ethers.utils.hexlify(ethers.utils.toUtf8Bytes(createdBlobFileName)));
  // console.log(data);
  const hex = ethers.utils.hexlify(data);
  // console.log(hex);
  const str = ethers.utils.toUtf8String(data);
  console.log("result", str.replace(/[\u0000\u0020]+$/, ""));
}

async function readFromNormalDirectory() {
  const rpc = "https://gateway.tenderly.co/public/sepolia";
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const contract = new ethers.Contract(deployedSepoliaNormalDirectory, IERC5018Abi, provider);
  const [data] = await contract.read(ethers.utils.hexlify(ethers.utils.toUtf8Bytes(createdNormalFileName)));
  const hex = ethers.utils.hexlify(data);
  const str = ethers.utils.toUtf8String(data);
  console.log("result", str);
}

// setupBlobDirectory();
// setupNormalDirectory();
// uploadToBlobDirectory();
// uploadToNormalDirectory();
// readFromBlobDirectory();
// readFromNormalDirectory();
