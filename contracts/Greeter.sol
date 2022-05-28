//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.1;

import "hardhat/console.sol";

contract GreeterFactory {

  // instantiate Bank contract
  Greeter greeter;

  //keep track of created Bank addresses in array 
  uint256 public contractID = 0;
  Greeter[] public list_of_greeters;

  mapping(uint256 => Greeter) greeterContract;


  // function arguments are passed to the constructor of the new created contract 
  function createGreeter(address _owner, uint256 _tokenID) external {
      greeter = new Greeter(_owner, _tokenID);
      list_of_greeters.push(greeter);

      greeterContract[contractID] = greeter;
      contractID += 1;
  }

  function getContractAddress(uint256 _contractID) public view returns(Greeter ) {
     return greeterContract[_contractID];
  }

}

contract Greeter {
   uint256 private tokenID;
   address public owner;

   string public greeting;

   constructor(address _owner, uint256 _tokenID) {
      tokenID = _tokenID;
      owner = _owner;
   }
   
   function greet() public view returns (string memory) {
      return greeting;
   }

   function setGreeting(string memory _greeting) public {
      console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
      greeting = _greeting;
   }
}