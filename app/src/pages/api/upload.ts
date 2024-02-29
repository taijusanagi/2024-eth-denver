import { deployedSepoliaBlobDirectory } from "@/lib/contracts";
import type { NextApiRequest, NextApiResponse } from "next";

const fs = require("fs");
const os = require("os");
const path = require("path");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

// this code does not work in app  api route, so use page api route
const { EthStorage } = require("ethstorage-sdk");

type ResponseData = {
  data?: {
    txHash: string;
    blobHash: string;
    directory: string;
    name: string;
  };
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (!req.body.content) {
    res.status(400).json({ error: "No content provided" });
    return;
  }
  // const blob = EncodeOpBlobs(Buffer.from(req.body.content));
  // console.log(blob);
  // console.log("blob.length", blob.length);
  const privateKey = process.env.ETH_STORAGE_SIGNER_PRIVATE_KEY; // 0x71165Cf095cc1A0F1649F5E249B1b9d3CB7Bfd02
  const rpc = process.env.ETH_STORAGE_BLOB_UPLOAD_RPC;

  const ethStorage = new EthStorage(rpc, privateKey, deployedSepoliaBlobDirectory);
  // current eth storage implementation requires a 5 blank postfix

  if (!req.body.name || !req.body.content) {
    res.status(400).json({ error: "Name or content not provided" });
    return;
  }

  if (typeof req.body.name != "string" || typeof req.body.content != "string") {
    res.status(400).json({ error: "Name or content type invalid" });
    return;
  }

  if (req.body.name.length > 100 || req.body.content.length > 10000) {
    res.status(400).json({ error: "Name or content too long" });
    return;
  }

  // add 1000 blank prefix to fix bug in eth storage data fetch
  const content = `${req.body.content}` + " ".repeat(1000);
  const name = req.body.name;
  console.log("content.length", content.length);
  // console.log(content);
  // Create a temporary file path
  const tempDir = os.tmpdir();
  const fileName = `${name}-${Date.now()}.txt`;
  console.log("fileName", fileName);
  const tempFilePath = path.join(tempDir, fileName);
  // Write the content to the temporary file
  await writeFileAsync(tempFilePath, content);
  let data;
  try {
    // Upload the file using its path
    // TODO: error handling
    data = await ethStorage.upload(tempFilePath);
  } finally {
    // Clean up: Delete the temporary file after upload
    fs.unlink(tempFilePath, (err: Error) => {
      if (err) console.error("Error removing temporary file:", err);
    });
    console.log("data", data);
    if (data) {
      res.status(200).json({
        data: {
          txHash: data.txHash,
          blobHash: data.blobHash,
          directory: deployedSepoliaBlobDirectory,
          name: fileName,
        },
      });
    } else {
      res.status(500).json({ error: "Error uploading file" });
    }
  }
}
