import {
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
  if (!chainId || !branchContentId) {
    return Response.json({ error: "Chain ID or branchContentId not provided" }, { status: 400 });
  }
  console.log(chainId, branchContentId);
  const sepoliaProvider = new ethers.providers.JsonRpcProvider(sepoliaRPC);
  const sepoliaEthereumStorageProvider = new ethers.providers.JsonRpcProvider(sepoliaEthereumStorageNodeRPC);
  const nftContentContract = new ethers.Contract(contentNFTAddress, contentNFTAbi, sepoliaProvider);
  const nftContentContractOnEtherStorageNode = new ethers.Contract(
    contentNFTAddress,
    contentNFTAbi,
    sepoliaEthereumStorageProvider
  );
  let storyBranchMinterProvider;
  let storyBranchMinterAddress;
  let storyBranchMinterAbi;
  if (chainId === "11155111") {
    storyBranchMinterProvider = new ethers.providers.JsonRpcProvider(sepoliaRPC);
    storyBranchMinterAddress = storyBranchMinterL1Address;
    storyBranchMinterAbi = storyBranchMinterL1Abi;
  } else {
    return Response.json({ error: "Chain ID not supported" }, { status: 400 });
  }
  const storyBranchMinterContract = new ethers.Contract(
    storyBranchMinterAddress,
    storyBranchMinterAbi,
    storyBranchMinterProvider
  );
  const [rootTokenId] = await storyBranchMinterContract.getContent(0);
  console.log(rootTokenId);
  const content = await nftContentContractOnEtherStorageNode.getContent(rootTokenId);
  console.log(content);
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content }],
    model: "gpt-3.5-turbo",
  });
  console.log(chatCompletion);
  return res.json({ content: chatCompletion.choices[0].message.content });
}
