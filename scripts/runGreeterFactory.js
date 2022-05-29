const { messagePrefix } = require("@ethersproject/hash");
const { expect } = require("chai");
const { ethers } = require("hardhat")

const main = async() => {
   const [owner] = await ethers.getSigners();
   const BrandNFTFactory = await ethers.getContractFactory("BrandNFT");
   const BrandNFT = await BrandNFTFactory.deploy();

   await BrandNFT.deployed();

   console.log("The smart contract is deployed on %s", BrandNFT.address);
   console.log("The smart contract is deployed by %s", owner.address);

   let mintedBrands = await BrandNFT.getMintedBrands();
   console.log("Mint Logs %s", mintedBrands);

   console.log("Test Run successful.");

};

const runMain = async() => {
   try {
      await main();
      process.exit(0);
   } catch (error) {
      console.log(error);
      process.exit(1);
   } 
};

runMain();