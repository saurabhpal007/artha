const { messagePrefix } = require("@ethersproject/hash");
const { expect } = require("chai");
const { ethers } = require("hardhat")

const main = async() => {
   const [owner, randomAddr] = await ethers.getSigners();

   /*
   const BrandNFTFactory = await ethers.getContractFactory("BrandNFT");
   const BrandNFT = await BrandNFTFactory.deploy();

   await BrandNFT.deployed();

   console.log("The smart contract is deployed on %s", BrandNFT.address);
   console.log("The smart contract is deployed by %s", owner.address);

   let mintedBrands = await BrandNFT.getMintedBrands();
   console.log("Mint Logs %s", mintedBrands);
   
   console.log("Test Run successful.");

   console.log("The smart contract is deployed on %s", BrandNFT.address);
   */

   const GreeterFactoryContract = await ethers.getContractFactory("GreeterFactory");
   const GreeterFactory = await GreeterFactoryContract.deploy();

   await GreeterFactory.deployed();
   console.log("GreeterFactory deployed on %s", GreeterFactory.address);

   const Greeter = await GreeterFactory.createGreeter(owner.address, 2);

   console.log("GreeterFactory address at: ", Greeter.to);

   const Greeter2 = await GreeterFactory.createGreeter(owner.address, 4);

   console.log("GreeterFactory address at: ", Greeter.to);

   const Greeter3 = await GreeterFactory.createGreeter(owner.address, 6);

   console.log("GreeterFactory address at: ", Greeter.to);

   console.log("\n")

   let greeterList = await GreeterFactory.getContractAddress(1);
   console.log("address of greeter Contract", greeterList);

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