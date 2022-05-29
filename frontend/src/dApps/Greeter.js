import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import abi from '../utils/Greeter.json';

const Greeter = (props) => {
  // Add components in the component folder
  // Render Methods

  const LOCAL_STORAGE_KEY = "currentGreeting";
  const getCurrentGreeting = (localStorage.getItem(LOCAL_STORAGE_KEY) !== "") ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) : 'Greet your customer';

  const [ currentAccount, setCurrentAccount ] = useState("");
  const [ Greeting, setgreeting ]  = useState("");
  const [ currentGreeting, setCurrentGreeting ] = useState(getCurrentGreeting);

  
  const contractAddress = props.contractAddress;
  const contractABI = abi.abi;


  const checkIfWalletIsConnect = async () => {
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
        setCurrentAccount(account)
        getGreeting()
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

  const writeGreeting = (_message) => {
    setgreeting(_message.target.value);
  }

  const greet = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const greeter = new ethers.Contract(contractAddress, contractABI, signer);

      //const greeter = await GreeterFactory.createGreeter(_owner, _tokenID);
      
      const greetingTxn = await greeter.setGreeting(Greeting);

      console.log("Mining...", greetingTxn.hash);

      await greetingTxn.wait();

      console.log("Mined...", greetingTxn.hash);

      setCurrentGreeting(Greeting);

      console.log(currentGreeting);

     } else {
       console.log("Ethereum object not found.");
     }
   } catch(error) {     
      console.log(error);
   }
  }

  const getGreeting = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const greeter = new ethers.Contract(contractAddress, contractABI, signer);

      const greeting = await greeter.greet(); 

     } else {
       console.log("Ethereum object not found.");
     }
   } catch(error) {     
      console.log(error);
   }
  }

  useEffect(() => {
    getGreeting();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentGreeting));
  }, [currentGreeting]);

  console.log("In greeter")
  return (
    <div className="bg-gray-900">
      <input  onChange={writeGreeting} value={Greeting} className="w-32 py-2 pl-10 text-sm rounded-md sm:w-auto focus:outline-none bg-gray-100 text-gray-800 focus:bg-gray-50 focus:border-indigo-600" />
      <button type="button" className="lg:ml-2 px-5 py-2 font-semibold rounded-md bg-green-400 text-gray-900" onClick={greet}>Greet</button>
      <div className="flex lg:mt-5 items-center justify-between p-6 border-l-8 sm:py-8 border-indigo-600 bg-gray-50 text-gray-800">
	      <span>{currentGreeting}</span>
      </div>
    </div>
  );

};

export default Greeter;
