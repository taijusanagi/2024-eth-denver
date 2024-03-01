export { default as functionRouterABI } from "./abi/functionRouter";

export const chainlinkConfig = {
  sepolia: {
    functionsRouterAddress: "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0",
    functionsSubscriptionId: 2020,
    functionsGasLimit: 300000, // max 300000
    functionsDonId: "0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000",
  },
};

export const script = `
  const chainId = args[0];
  const branchContentId = args[1];
  const apiResponse = await Functions.makeHttpRequest({
  url: 'https://2024-eth-denver.vercel.app/api/ai',
  params: {
  chainId,
  branchContentId,
  },
  timeout: 9000, // this is the trick
  });
  if (apiResponse.error) {
    return Functions.encodeString("I'm sorry, I don't understand. Could you explain that to me, please?");
  }
  const { data } = apiResponse;
  return Functions.encodeString(data.content);
`;

// for debug
// return Functions.encodeString(apiResponse.message + ":" + apiResponse.code + ":" + apiResponse.response);
