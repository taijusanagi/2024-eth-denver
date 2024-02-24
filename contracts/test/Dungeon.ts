import hre from "hardhat";

describe("Dungeon", function () {
  async function getFixture() {
    const [owner] = await hre.viem.getWalletClients();

    const seed = 1;
    const width = 14;
    const height = 14;
    const maxTunnels = 100;
    const maxLength = 5;

    const dungeon = await hre.viem.deployContract("Dungeon", [seed, width, height, maxTunnels, maxLength]);
    return {
      owner,
      dungeon,
    };
  }

  describe("GenerateMap", function () {
    it("Should work", async function () {
      const { dungeon } = await getFixture();
      const map = await dungeon.read.getMap();
      var result = "";
      map.forEach((row) => {
        row.forEach((cell) => {
          result = result + cell.toString() + ",";
        });
        result = result + "\n";
      });
      console.log(result);
    });
  });
});
