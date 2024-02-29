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

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  // const apiKey = searchParams.get("apikey");
  // if (apiKey != process.env.API_KEY) {
  //   return Response.json({ error: "Bad Request" }, { status: 400 });
  // }

  const { chainId, branchContentId } = req.query;

  console.log(chainId);
  console.log(branchContentId);

  if (!chainId || !branchContentId) {
    return Response.json({ error: "Chain ID or branchContentId not provided" }, { status: 400 });
  }

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
    console.log(sepoliaRPC);
    storyBranchMinterProvider = new ethers.providers.JsonRpcProvider(sepoliaRPC);
    storyBranchMinterAddress = storyBranchMinterL1Address;
    storyBranchMinterAbi = storyBranchMinterL1Abi;
  } else {
    // return 500
    return Response.json({ error: "Chain ID not supported" }, { status: 400 });
  }
  const blockNumber = await storyBranchMinterProvider.getBlockNumber();
  // console.log(storyBranchMinterProvider, storyBranchMinterAddress, storyBranchMinterAbi);
  // const storyBranchMinterContract = new ethers.Contract(
  //   storyBranchMinterAddress,
  //   storyBranchMinterAbi,
  //   storyBranchMinterProvider
  // );
  // const dd = await storyBranchMinterContract.subscriptionId();
  // console.log(dd);
  console.log(blockNumber);

  const content = "";
  // const chatCompletion = await openai.chat.completions.create({
  //   messages: [{ role: "user", content }],
  //   model: "gpt-3.5-turbo",
  // });
  // return Response.json({ content: chatCompletion.choices[0].message.content });
  res.status(500).json("ok");

  // return Response.json({ ok: "ok" });
}
