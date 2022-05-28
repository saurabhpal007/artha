const { expect } = require("chai");
const { ethers } = require("hardhat")

const main = async() => {
   
   const [deployer] = await ethers.getSigners();
   const accountBalance = await deployer.getBalance();

   console.log("Deploying contracts with account: ", deployer.address);
   console.log("Account balance: ", accountBalance.toString());

   const BrandNFTFactory = await ethers.getContractFactory("BrandNFT");
   const BrandNFTF = await BrandNFTFactory.deploy();

   await BrandNFTF.deployed();

   console.log("The smart contract is deployed on %s", BrandNFT.address);

   const GreeterFactory = await ethers.getContractFactory("Greeter");
   const Greeter = await GreeterFactory.deploy();

   await Greeter.deployed();

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