import Replicate from "replicate";

import type { NextApiRequest, NextApiResponse } from "next";
import { Lekton } from "next/font/google";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { stories, style } = req.body as any;
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });
  const fps = 10;
  const max_frames = 200;
  const frame_increment = max_frames / stories.length;
  const positivePrompt = "masterpiece, best quality, insanely detailed, intricate, cartoon, scenery";
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
      fps,
      zoom: "0: (1.04)",
      angle: "0:(0)",
      sampler: "klms",
      max_frames: 100,
      translation_x: "0: (0)",
      translation_y: "0: (0)",
      color_coherence: "Match Frame 0 LAB",
      animation_prompts,
    },
  });
  return res.json({ predictionId: prediction.id });
}
