const BlockChain = require("./blockchain");
const blockchain = new BlockChain();
blockchain.addBlock({ data: "initial data" });
let prevTimestamp, nextTimestamp, nextBlock, timeDiff, average;
const times = [];
for (let i = 0; i < 10000; i++) {
  prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;
  blockchain.addBlock({ data: `block ${i}` });
  // console.log("First block in chain", blockchain.chain[blockchain.chain.length-1])
  nextBlock = blockchain.chain[blockchain.chain.length - 1];
  nextTimestamp = nextBlock.timestamp;
  timeDiff = nextTimestamp - prevTimestamp;
  times.push(timeDiff);
  average = times.reduce((total, num) => total + num) / times.length;
  console.log(`time to mine a Block: ${timeDiff}ms . Difficulty: ${nextBlock.difficulty}. Average Time: ${average}. `);
}
