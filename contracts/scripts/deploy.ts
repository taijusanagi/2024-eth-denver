import hre from "hardhat";

async function main() {
  const dungeon = await hre.viem.deployContract("Dungeon");
  console.log(`Dungeon deployed to ${dungeon.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
