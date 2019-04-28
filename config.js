const MINE_RATE=5000
const INITIAL_DIFFICULTY = 3;
const GENESIS_DATA = {
  timestamp: 1,
  lastHash: "------------------",
  hash: "hash-one",
  difficulty: INITIAL_DIFFICULTY,
  nonce: 1000,
  data: [{ name: "Mutuba" }, { City: "Nairobi" }]
};
module.exports = { GENESIS_DATA , MINE_RATE}; 
