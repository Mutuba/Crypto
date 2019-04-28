const hexToBinary = require("hex-to-binary");
const Block = require("./block");
const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");
describe("Block", () => {
  const timestamp = 2000;
  const lastHash = "foo-hash";
  const hash = "bar-hash";
  const data = ["foo-data", "boo-data"];
  const nonce = 1;
  const difficulty = 1;
  const block = new Block({
    timestamp,
    lastHash,
    hash,
    data,
    nonce,
    difficulty
  });
  it("has timestamp, lastHash, hash and data fields", () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.nonce).toEqual(nonce);
    expect(block.difficulty).toEqual(difficulty);
  });
  describe("genesis", () => {
    const genesisBlock = Block.genesis();
    it("returns a Block instance", () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });
    it("returns genesis data", () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });
  describe("mineBlock", () => {
    const lastBlock = Block.genesis();
    const data = "mined data";
    const minedBlock = Block.mineBlock({ lastBlock, data });
    it("returns an instance of Block", () => {
      expect(minedBlock instanceof Block).toBe(true);
    });
    it("sets the `lastHash` to be `hash` of the last block", () => {
      // console.log(minedBlock.hash, "gvhbjnkrgthjt4h5w")
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });
    it("sets the `data`", () => {
      expect(minedBlock.data).toEqual(data);
    });
    it("sets a `timestamp`", () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });
    it("creates a proper sha256 `hash` based on proper input", () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(
          minedBlock.timestamp,
          minedBlock.nonce,
          minedBlock.difficulty,
          lastBlock.hash,
          minedBlock.data
        )
      );
    });
    it("sets a `hash` with  difficulty criteria", () => {
      expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)).toEqual(
        "0".repeat(minedBlock.difficulty)
      );
    });
    it(" adjust the difficulty", () => {
      const possibleResults = [
        lastBlock.difficulty + 1,
        lastBlock.difficulty - 1
      ];
      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
    });
    // console.log(minedBlock.timestamp, "hjkefvgrhtdfjyjhnbgrefgrhtj");
  });
  describe("adjustDifficulty", () => {
    it("raises difficulty for a quickly mined block", () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE - 100
        })
      ).toEqual(block.difficulty + 1);
    });
    it("lowers difficulty for a slowly mined block", () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE + 100
        })
      ).toEqual(block.difficulty - 1);
    });
    it("has lower limit of 1", () => {
      block.difficulty = -1;
      expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
    });
  });
});
