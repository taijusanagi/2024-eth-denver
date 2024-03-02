import Replicate from "replicate";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { predictionId } = req.query;
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    const { logs, output } = await replicate.predictions.get(predictionId as string);
    console.log(logs);
    return res.json({ output, logs });
  } catch (e: any) {
    console.log(e.message);
    return res.json({ output: "", logs: "" });
  }
}
