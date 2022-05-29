import React, { useState, useEffect } from "react";
import abi from '../utils/GreeterFactory.json';
import { ethers } from 'ethers';
import Greeter from '../dApps/Greeter';

const AddApps = (props) => {
  // Render Methods
  const [ currentAccount, setCurrentAccount ] = useState("");

  //App Support - Greeter.io
  const [ greeterRenderFlag, setGreeterRenderFlag ] = useState(0);
  const [ greeterAddress, setGreeterAddress ] = useState("");

  const contractAddress = "0xEa1dD8b5c94741D81DCE06720645AbaAd65E9e53";
  const contractABI = abi.abi;

  const checkIfWalletIsConnect = async (owner, tokenID) => {
    // we have to check if we have access to window.ethereum

    try {
      const { ethereum } = window;
      if(!ethereum) {
        console.log("Make sure you have MetaMask!");
      } else {
        console.log("We have an ethereum Object", ethereum);
      }

      const accounts = await ethereum.request({method : "eth_accounts"});

      if(accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized Account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try{
      const{ ethereum } = window;

      if(!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const addGreeterApp = async (_owner, _tokenID) => {
      console.log("Adding Greeter.io App, this may take some time.");
         //run the contract factory to Adding Apps
         //deploy the greeter smart contract
         //get the contract address and abi
      try {
         const { ethereum } = window;
         if (ethereum) {
         const provider = new ethers.providers.Web3Provider(ethereum);
         const signer = provider.getSigner();
         const GreeterFactory = new ethers.Contract(contractAddress, contractABI, signer);

         //const greeter = await GreeterFactory.createGreeter(_owner, _tokenID);
         
         let contractID = await GreeterFactory.contractID();
         console.log("contract ID %s deployed", contractID);

         let greeterContract = await GreeterFactory.getContractAddress(contractID - 1);
         console.log("Greeter App is successfully created at", greeterContract);
         
         setGreeterAddress(greeterContract);
         setGreeterRenderFlag(1);

        }
      } catch(error) {     
         console.log(error);
      }
   }

  useEffect(() => {
    checkIfWalletIsConnect();
  },[]);

  return (
    //setup route to App on "Open App Button click"

    <div className="flex flex-col justify-center p-3 mx-auto">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="relative flex flex-col items-center lg:m-10 max-w-lg gap-4 p-6 rounded-md shadow-md sm:py-8 sm:px-12 bg-gray-900 text-gray-100">
          <button className="absolute top-2 right-2">		
          </button>	
          <h2 className="text-2xl font-semibold leading-tight tracking-wide">Greeter.io</h2>
          <p className="flex-1 text-center text-gray-400">Greeter.io is an App to integrate any tesamony into your NFT assets</p>
          {greeterRenderFlag == 0 && (
              <button type="button" className="px-8 py-3 font-semibold rounded-md bg-green-400 text-gray-900" onClick={(e) => addGreeterApp(props.owner, props.tokenID)}>Add</button>
            )}

          {!greeterRenderFlag == 0 && (
              <Greeter contractAddress={greeterAddress}/>
         )}
        </div>

        <div className="relative flex flex-col items-center lg:m-10 max-w-lg gap-4 p-6 rounded-md shadow-md sm:py-8 sm:px-12 bg-gray-900 text-gray-100">
          <button className="absolute top-2 right-2">		
          </button>	
          <h2 className="text-2xl font-semibold leading-tight tracking-wide">Greeter.io</h2>
          <p className="flex-1 text-center text-gray-400">Greeter.io is an App to integrate any tesamony into your NFT assets</p>
          <button type="button" className="px-8 py-3 font-semibold rounded-md bg-green-400 text-gray-900">Add App</button>
        </div>

        <div className="relative flex flex-col items-center lg:m-10 max-w-lg gap-4 p-6 rounded-md shadow-md sm:py-8 sm:px-12 bg-gray-900 text-gray-100">
          <button className="absolute top-2 right-2">		
          </button>	
          <h2 className="text-2xl font-semibold leading-tight tracking-wide">Greeter.io</h2>
          <p className="flex-1 text-center text-gray-400">Greeter.io is an App to integrate any tesamony into your NFT assets</p>
          <button type="button" className="px-8 py-3 font-semibold rounded-md bg-green-400 text-gray-900">Add App</button>
        </div>

      </div>
    </div>


  );

};

export default AddApps;
