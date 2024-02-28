import type { NextApiRequest, NextApiResponse } from "next";

const fs = require("fs");
const os = require("os");
const path = require("path");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

const { EthStorage } = require("ethstorage-sdk");

type ResponseData = {
  data: {
    directory: string;
    name: string;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  console.log(req.query);
  const privateKey = process.env.ETH_STORAGE_SIGNER_PRIVATE_KEY; // 0x71165Cf095cc1A0F1649F5E249B1b9d3CB7Bfd02
  const rpc = process.env.ETH_STORAGE_BLOB_UPLOAD_RPC;
  const deployedSepoliaBlobDirectory = "0x53E2e6379a5697f09C8Eedd4fE05Da4f9A977269";
  const ethStorage = new EthStorage(rpc, privateKey, deployedSepoliaBlobDirectory);
  const content = "hello world!!     ";
  // Create a temporary file path
  const tempDir = os.tmpdir();
  const fileName = `${Date.now()}.txt`;
  console.log("fileName", fileName);
  const tempFilePath = path.join(tempDir, fileName);
  // Write the content to the temporary file
  await writeFileAsync(tempFilePath, content);
  try {
    // Upload the file using its path
    ethStorage.upload(tempFilePath).then(() => {
      fs.unlink(tempFilePath, (err: Error) => {
        if (err) console.error("Error removing temporary file:", err);
      });
    });
  } catch {
    fs.unlink(tempFilePath, (err: Error) => {
      if (err) console.error("Error removing temporary file:", err);
    });
  } finally {
    // Clean up: Delete the temporary file after upload
    res.status(200).json({ data: { directory: deployedSepoliaBlobDirectory, name: fileName } });
  }
}
