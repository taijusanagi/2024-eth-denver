import { upload } from "ethstorage-sdk";

export async function GET(req: Request) {
  const content = "";
  // console.log(ethStorage);
  // make it temp file and pass file path
  // ethfsUploader.deploy();
  console.log(upload);
  return Response.json({ content: "ok" });
}
