import React, { useState, useEffect } from "react";
import abi from '../utils/GreeterFactory.json';
import { ethers } from 'ethers';

const AddApps = (props) => {
  // Render Methods
  const [ currentAccount, setCurrentAccount ] = useState("");

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
         // pass this as a prop to Greeter.js and render Greeter.js in routed path
      try {
         const { ethereum } = window;
         if (ethereum) {
         const provider = new ethers.providers.Web3Provider(ethereum);
         const signer = provider.getSigner();
         const GreeterFactory = new ethers.Contract(contractAddress, contractABI, signer);

         //const Greeter = await GreeterFactory.createGreeter(_owner, _tokenID);
         
         //console.log("Greeter App is successfully created at %s", Greeter);

         let contractID = await GreeterFactory.contractID();
         console.log("contract ID %s deployed", contractID);

         let greeterList = await GreeterFactory.getContractAddress(contractID - 1);
         console.log("address of greeter Contract", greeterList);

            
         /*
         {Greeter && (
            <Greeter contractAddress= {Greeter} contractABI= {contractABI} /> 
         )}
         */
         
         }
      } catch(error) {     
         console.log(error);
      }
   }

  useEffect(() => {
    checkIfWalletIsConnect();
  },[]);

  // Add components in the component folder

  return (
    <div className="mainContainer">

         <div className="max-w-xs p-6 rounded-md shadow-md dark:bg-gray-900 dark:text-gray-50">
            <div className="mt-6 mb-2">
               <h2 className="text-xl font-semibold tracking-wide">Greeter.io</h2>
            </div>
            <p className="dark:text-gray-100">Setup customized greeting for your brand.</p>
            <button type="button" className="px-8 py-3 font-semibold rounded bg-gray-800 text-gray-100" onClick={(e) => addGreeterApp(props.owner, props.tokenID)}>Add</button>
         </div>

    </div>
  );

};

export default AddApps;
