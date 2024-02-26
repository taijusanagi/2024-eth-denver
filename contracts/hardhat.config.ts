import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      forking: {
        url: "https://gateway.tenderly.co/public/sepolia",
      },
    },
    sepolia: {
      url: "https://rpc.sepolia.ethpandaops.io",
      accounts,
    },
  },
};

task("debug", "start story")
  .addParam("address", "Contract address")
  .setAction(async (taskArgs, hre) => {
    // const script = `
    // function getDayDifference(startDate, endDate) {
    //   const oneDay = 24 * 60 * 60 * 1000;
    //   const start = new Date(startDate);
    //   const end = new Date(endDate);
    //   const diffInDays = Math.round(Math.abs((end.getTime() - start.getTime()) / oneDay));
    //   return diffInDays;
    // }
    // const apiResponse = await Functions.makeHttpRequest({
    //     url: 'https://date.nager.at/Api/v2/NextPublicHolidays/US'
    // })
    // const holiday = apiResponse.data[0];
    // if(!holiday) {
    //     console.log('No more holidays this year :(');
    // }
    // const today = new Date();
    // const holidayDate = new Date(holiday.date);
    // const daysTillHoliday = getDayDifference(today, holidayDate);
    // return Functions.encodeUint256(daysTillHoliday);
    // `;
    const script = `
    const address = args[0];
    const index = args[1];
    const content = args[2];
    const apiResponse = await Functions.makeHttpRequest({
    url: 'https://2024-eth-denver.vercel.app/api',
    params: {
    address,
    index,
    content
    }
    });
    if (apiResponse.error) {
    throw Error('Request failed');
    }
    const { data } = apiResponse;
    return Functions.encodeString(data.ok);
    `;
    const address = taskArgs.address;
    const contract = await hre.viem.getContractAt("StoryGameNFT", address);
    const tx = await contract.write.debugChainlink([script]);
    console.log(tx);
  });

task("view", "start story")
  .addParam("address", "Contract address")
  .setAction(async (taskArgs, hre) => {
    const address = taskArgs.address;
    const contract = await hre.viem.getContractAt("StoryGameNFT", address);
    const base = await contract.read.baseStory();
    console.log(base);
  });

task("start", "start story")
  .addParam("address", "Contract address")
  .setAction(async (taskArgs, hre) => {
    const address = taskArgs.address;
    const contract = await hre.viem.getContractAt("StoryGameNFT", address);
    const tx = await contract.write.start();
    console.log(tx);
  });

export default config;
