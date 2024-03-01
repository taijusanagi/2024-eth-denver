import {
  IERC5018Abi,
  contentNFTAbi,
  contentNFTAddress,
  sepoliaEthereumStorageNodeRPC,
  sepoliaRPC,
  storyBranchMinterL1Abi,
  storyBranchMinterL1Address,
} from "@/lib/contracts";
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { chainId, branchContentId } = req.query;
  if (!chainId || !branchContentId || typeof chainId != "string" || typeof branchContentId != "string") {
    return res.status(400).json({ error: "Chain ID or branchContentId not provided" });
  }
  console.log(chainId, branchContentId);
  const sepoliaProvider = new ethers.providers.JsonRpcProvider(sepoliaRPC);
  const sepoliaEthereumStorageProvider = new ethers.providers.JsonRpcProvider(sepoliaEthereumStorageNodeRPC);
  const nftContentContract = new ethers.Contract(contentNFTAddress, contentNFTAbi, sepoliaProvider);
  let storyBranchMinterProvider;
  let storyBranchMinterAddress;
  let storyBranchMinterAbi;
  if (chainId === "11155111") {
    storyBranchMinterProvider = new ethers.providers.JsonRpcProvider(sepoliaRPC);
    storyBranchMinterAddress = storyBranchMinterL1Address;
    storyBranchMinterAbi = storyBranchMinterL1Abi;
  } else {
    return res.status(400).json({ error: "Chain ID not supported" });
  }
  const storyBranchMinterContract = new ethers.Contract(
    storyBranchMinterAddress,
    storyBranchMinterAbi,
    storyBranchMinterProvider
  );
  const [rootTokenId, oracleResponses, userInteractions] = await storyBranchMinterContract.getContent(branchContentId);
  console.log(rootTokenId);
  const [directory, name] = await nftContentContract.rootContentLocations(rootTokenId);
  const blobRegistryOnEtherStorageNode = new ethers.Contract(directory, IERC5018Abi, sepoliaEthereumStorageProvider);
  const [content] = await blobRegistryOnEtherStorageNode.read(name);
  const modifiedRootContent = ethers.utils.toUtf8String(content).replace(/^[\u0000\u0020]+|[\u0000\u0020]+$/g, "");
  const messages: any = [{ role: "system", content: modifiedRootContent }];
  oracleResponses.forEach((response: string, index: number) => {
    messages.push({ role: "assistant", content: response });
    messages.push({ role: "user", content: userInteractions[index] });
  });
  console.log(messages);
  const chatCompletion = await openai.chat.completions.create({
    messages,
    // messages: [{ role: "user", content }],
    model: "gpt-3.5-turbo",
    // seed: parseInt(branchContentId), // this is required to use chat gpi in functions
    seed: 0,
    temperature: 0,
  });
  console.log(chatCompletion.choices[0].message.content);
  return res.json({ content: chatCompletion.choices[0].message.content, error: { code: "ok", message: "no" } });
}
