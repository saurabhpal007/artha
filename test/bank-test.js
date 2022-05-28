const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deploying a BankFactory and creating Bank instances ", function () {

  it("Should instantiate the created Bank and call its functions", async () => {

    // ContractFactory in ethers.js is an abstraction used to deploy new smart contracts, so Token here is a factory for instances of our token contract.
    const GF = await ethers.getContractFactory('GreeterFactory');
    const Greeter = await ethers.getContractFactory('Greeter');

    // deploy bank factory
    const gf = await GF.deploy();
    await gf.deployed();

    // call function with (address owner, uint256 number) parameters
    const tx1_receipt = await gf.createGreeter("0x5FbDB2315678afecb367f032d93F642f64180aa3", 2);

    console.log("BankFactory address at: ", tx1_receipt.to);
    console.log("\n")

    // Get the addresses of the deployed contracts 
    const bank_address = await gf.list_of_greeters();
    console.log("BankFactory array of banks, address at (index 0): ", bank_address);
    console.log("\n")


  })

});