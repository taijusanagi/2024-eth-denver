import hre from "hardhat";

describe("Dungeon", function () {
  async function getFixture() {
    const [owner] = await hre.viem.getWalletClients();
    return {
      owner,
    };
  }

  describe("Deployment", function () {
    it("Should work", async function () {
      const { owner } = await getFixture();
    });
  });
});
