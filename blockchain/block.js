const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");
class Block {
  constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    (this.nonce = nonce), (this.difficulty = difficulty);
  }
  static genesis() {
    return new this(GENESIS_DATA);
  }
  //  const lastBlock = Block.genesis();
  static mineBlock({ lastBlock, data }) {
    // console.log(lastBlock.hash, "block1");
    let timestamp, hash;
    const lastHash = lastBlock.hash;
    const { difficulty } = lastBlock;
    let nonce = 0;
    do {
      nonce++;
      timestamp = Date.now();
      hash = cryptoHash(timestamp, lastHash, data, difficulty, nonce);
      // Sample substring generates a subset of a string based on start and end params e.g 0,4 returns from char[0] to char[4]
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));
    return new this({
      timestamp,
      lastHash,
      data,
      difficulty,
      nonce,
      hash
    });
  }
}
// const block1 = Block.genesis()
// const block2 = new Block({
//   timestamp: "01/01/01",
//   lastHash: "foo-lastHash",
//   hash: "foo-hash",
//   data: "foo-data"
// });
// const data="Mutuba"
// const block2= Block.mineBlock({block1, data })
// console.log(block1,block2, "gf hj knbhnk57")
module.exports = Block;
