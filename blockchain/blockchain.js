const Block = require("./block");
const cryptoHash = require("./crypto-hash");
class BlockChain {
  constructor(chain) {
    // first entry in the chain array is the genesis block
    this.chain = [Block.genesis()];
  }
  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }
    for (let i = 1; i < chain.length; i++) {
      const actualLastHash = chain[i - 1].hash;
      const { timestamp, lastHash, hash,nonce, difficulty, data } = chain[i];
      if (lastHash !== actualLastHash) return false;

      const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
      if (hash !== validatedHash) return false;
    }
    return true;
  }
  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      // Access the chain array and pick the last item in the array
      // mineBlock function needs lastBlock to process lastHash
      lastBlock: this.chain[this.chain.length - 1],
      data
    });
    //Push the newly created block into the chain
    this.chain.push(newBlock);
  }
  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error("The incoming block must be longer");
      return;
    }
    if (!BlockChain.isValidChain(chain)) {
      console.error("The incoming chain has to be valid");
      return;
    }
    console.log("Replacing chain with ", chain);
    this.chain = chain;
  }
}
// const myChain = new BlockChain();
// myChain.addBlock({ data: "Giraffe" });
// console.log(myChain, "bhwdfegvrsbhtfrgt");
module.exports = BlockChain;
