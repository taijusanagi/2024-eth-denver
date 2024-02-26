import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  // const apiKey = searchParams.get("apikey");
  // if (apiKey != process.env.API_KEY) {
  //   return Response.json({ error: "Bad Request" }, { status: 400 });
  // }
  const address = searchParams.get("address") as string;
  const index = searchParams.get("index") as string;
  const content = searchParams.get("content") as string;
  console.log("debug");
  console.log(address);
  console.log(index);
  console.log(content);
  // const chatCompletion = await openai.chat.completions.create({
  //   messages: [{ role: "user", content }],
  //   model: "gpt-3.5-turbo",
  // });
  // return Response.json(chatCompletion.choices[0].message.content);

  return Response.json({ ok: "ok" });
}
