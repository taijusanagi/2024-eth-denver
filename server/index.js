const fs = require("fs");
const os = require("os");
const path = require("path");
const util = require("util");
const { EthStorage } = require("ethstorage-sdk");
const { ethers } = require("ethers");

const writeFileAsync = util.promisify(fs.writeFile);

const deployedSepoliaDirectory = "0x85c498a8a6a9ad9f0bdc13319e2276cd665d2de1";
const deployedSepoliaNormalDirectory = "";
const createdFileName = "1708988973302.txt";
// const createdFileName = "1708990567024.txt";

const IERC5018Abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "chunkId",
        type: "uint256",
      },
    ],
    name: "chunkSize",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
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
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
    ],
    name: "countChunks",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "destruct",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "chunkId",
        type: "uint256",
      },
    ],
    name: "getChunkHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
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
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "chunkId",
        type: "uint256",
      },
    ],
    name: "readChunk",
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
  {
    inputs: [],
    name: "refund",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "remove",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "chunkId",
        type: "uint256",
      },
    ],
    name: "removeChunk",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
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
    name: "size",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "chunkId",
        type: "uint256",
      },
    ],
    name: "truncate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
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
      {
        internalType: "uint256",
        name: "chunkId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "writeChunk",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];
const IERC5018ForBlobAbi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "chunkId",
        type: "uint256",
      },
    ],
    name: "chunkSize",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
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
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
    ],
    name: "countChunks",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "destruct",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "chunkId",
        type: "uint256",
      },
    ],
    name: "getChunkHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
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
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "chunkId",
        type: "uint256",
      },
    ],
    name: "readChunk",
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
  {
    inputs: [],
    name: "refund",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "remove",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "chunkId",
        type: "uint256",
      },
    ],
    name: "removeChunk",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
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
    name: "size",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "chunkId",
        type: "uint256",
      },
    ],
    name: "truncate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "upfrontPayment",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "uint256[]",
        name: "chunkIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "sizes",
        type: "uint256[]",
      },
    ],
    name: "writeChunk",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];
const IFlatDirectoryAbi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "filename",
        type: "bytes",
      },
    ],
    name: "files",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// this function only called for setup
async function setupBlobDirectory() {
  const privateKey = process.env.PRIVATE_KEY;
  const rpc = process.env.RPC;
  const ethStorage = new EthStorage(rpc, privateKey);
  // this method uses below as blob manager
  // https://sepolia.etherscan.io/address/0x804C520d3c084C805E37A35E90057Ac32831F96f
  const result = await ethStorage.deploySepoliaDirectory();
  console.log(result);
}

async function setupNormalDirectory() {
  const privateKey = process.env.PRIVATE_KEY;
  const rpc = process.env.RPC;
  const ethStorage = new EthStorage(rpc, privateKey);
  // this method uses below as blob manager
  // https://sepolia.etherscan.io/address/0x804C520d3c084C805E37A35E90057Ac32831F96f
  const result = await ethStorage.deployNormalDirectory();
  console.log(result);
}

async function upload() {
  const privateKey = process.env.PRIVATE_KEY;
  // should use rpc which suports blob upload
  const rpc = process.env.RPC;
  const ethStorage = new EthStorage(rpc, privateKey, deployedSepoliaDirectory);
  const content = "hello";

  // Create a temporary file path
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `${Date.now()}.txt`);
  console.log(tempFilePath);

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

async function read() {
  // const provider = new ethers.providers.JsonRpcProvider(process.env.RPC);
  const provider = new ethers.providers.JsonRpcProvider("http://65.108.236.27:9540");
  // const contract = new ethers.Contract(deployedSepoliaDirectory, IERC5018Abi, provider);
  const contract = new ethers.Contract(deployedSepoliaDirectory, IERC5018Abi, provider);
  console.log(ethers.utils.hexlify(ethers.utils.toUtf8Bytes(createdFileName)));
  const data = await contract.read(ethers.utils.hexlify(ethers.utils.toUtf8Bytes(createdFileName)));
  console.log(data);
  // const hex = ethers.utils.hexlify(data);
  // const str = ethers.utils.toUtf8String(data);
  // console.log(str);
}

// setupNormalDirectory();
read();
// upload();
