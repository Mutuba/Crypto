const BlockChain = require("./blockchain");
const Block = require("./block");
describe("BlockChain", () => {
  let blockchain, newChain, originalChain;
  beforeEach(() => {
    blockchain = new BlockChain();
    originalChain = blockchain.chain;
    newChain = new BlockChain();
  });
  it("contains a chain array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });
  it("starts with genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });
  it("adds a new block to the chain", () => {
    const newData = "foo bar";
    blockchain.addBlock({ data: newData });
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });
  describe("isValidChain", () => {
    describe("when chain does not start with genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = {
          data: "fake-genesis"
        };
        // validating if a particular chain is valid after inserting a wromng genesis block
        expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
      });
    });
    describe("When block starts with genesis block and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "Dove" });
        blockchain.addBlock({ data: "Antelope" });
        blockchain.addBlock({ data: "Giraffe" });
      });
      describe("and lastHash reference has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "broken-lastHash";
          expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
        });
        describe("and chain contains block with invalid field", () => {
          it("returns false", () => {
            blockchain.chain[2].data = "some-bad-data";
            expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
          });
        });
        describe("and the chain does not contain any invalid blocks", () => {
          it("returns true", () => {
            expect(BlockChain.isValidChain(blockchain.chain)).toBe(true);
          });
        });
      });
    });
  });
  describe("replaceChain", () => {
    // let errorMock, logMock;
    // beforeEach(() => {
    //   errorMock = jest.fn();
    //   logMock = jest.fn();
    //   global.console.error = errorMock;
    //   global.console.log = logMock;
    // });
    describe("when chain is not longer", () => {
      it("does not replace the chain", () => {
        newChain.chain[0] = { new: "chain" };
        blockchain.replaceChain(newChain.chain);
        expect(blockchain.chain).toEqual(originalChain);
      });
      // it("logs an error", () => {
      //   // expect(errorMock).toHaveBeenCalled();
      //   expect(errorMock).toHaveBeenCalled();
      // });
    });
    describe("when the new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "Dove" });
        newChain.addBlock({ data: "Antelope" });
        newChain.addBlock({ data: "Giraffe" });
      });
      describe("and the chain is invalid", () => {
        it("does not replace the chain", () => {
          newChain.chain[2].hash = "some-bad-hash";
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(originalChain);
        });
      });
      describe("and the chain is valid", () => {
        it("replaces the chain", () => {
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(newChain.chain);
        });
      });
    });
  });
});
