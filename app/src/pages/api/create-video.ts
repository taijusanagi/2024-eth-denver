import Replicate from "replicate";

import type { NextApiRequest, NextApiResponse } from "next";
import { Lekton } from "next/font/google";
import { use } from "react";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { stories, style, image } = req.body as any;
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });
  const fps = 10;
  const max_frames = 100;
  const width = 512;
  const height = 256;
  const use_init = image != "" && image != undefined && image != null;
  const init_image = use_init ? image : undefined;
  const frame_increment = max_frames / stories.length;
  const positivePrompt = "masterpiece, best quality, insanely detailed, intricate, scenery ";
  let animation_prompts = "";
  stories.forEach((story: string, index: number) => {
    const frame_index = index * frame_increment;
    animation_prompts = animation_prompts + `${frame_index}: ${positivePrompt}, ${style}, ${story} `;
    if (index < stories.length - 1) {
      animation_prompts = animation_prompts + "| ";
    }
  });
  console.log("animation_prompts", animation_prompts);
  const prediction = await replicate.predictions.create({
    version: process.env.DEFORUM_MODEL_VERSION || "",
    input: {
      width,
      height,
      fps,
      max_frames,
      animation_prompts,
      use_init,
      init_image,
    },
  });
  return res.json({ predictionId: prediction.id });
}
