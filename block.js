const hexToBinary = require("hex-to-binary");
const { GENESIS_DATA, MINE_RATE } = require("./config");
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
  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;
    const lowerLimit = 1;
    // Ensure difficulty does not go below 1
    if (difficulty < lowerLimit) return 1;

    // block was mined too slow
    if (timestamp - originalBlock.timestamp > MINE_RATE) return difficulty - 1;
    return difficulty + 1;
  }
  //  const lastBlock = Block.genesis();
  static mineBlock({ lastBlock, data }) {
    // console.log(lastBlock.hash, "block1");
    let timestamp, hash;
    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let nonce = 0;
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timestamp
      });
      hash = cryptoHash(timestamp, lastHash, data, difficulty, nonce);
      // Sample substring generates a subset of a string based on start and end params e.g 0,4 returns from char[0] to char[4]
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    );
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
