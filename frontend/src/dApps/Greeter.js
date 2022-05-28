import './styles/App.css';
import React, { useState, useEffect } from "react";
import abi from './utils/BrandNFT.json';
import { ethers } from 'ethers';

const App = (props) => {
  // Render Methods
  const [ currentAccount, setCurrentAccount ] = useState("");
  const [ allBrands, setAllBrands ] = React.useState([]);

  const contractAddress = "0xFb2B571CA967CD8a67E27E729Be7Be434e0e038e";
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
        getMintedBrands()
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

  const getMintedBrands = async () => {
    try {
      const { ethereum } = window;

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const BrandNFTContract = new ethers.Contract(contractAddress, contractABI, signer);

        const mintedBrands = await BrandNFTContract.getMintedBrands();
        
        console.log(mintedBrands);

        let mintedBrandsClean=[];
        mintedBrands.forEach(mintedBrand => {
          mintedBrandsClean.push({
            owner: mintedBrand.nftOwner,
            tokenID: mintedBrand.tokenId.toString(),
            tokenUri: mintedBrand.tokenURI
          });
        });

        setAllBrands(mintedBrandsClean);

        console.log(allBrands);
      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    checkIfWalletIsConnect();
  },[]);

  // Add components in the component folder

  return (
    <div className="mainContainer">


      {!currentAccount && (
                  <button className="connectWallet" onClick={connectWallet}>
                    Connect with MetaMask Wallet
      </button>)}

      {currentAccount && (
        <AddBrand/>
      )}

      <div className="messageContainer">
      {allBrands.map((brand, index) => {
          return (
              <div key={index} style={{ background: "linear-gradient(154deg, #02c4fb, #826df3)", marginTop: "16px", padding: "8px"}}>
                <div style={{color: "#bbb"}}>Owner: {brand.owner}</div>
                <div style={{color: "#bbb"}}>tokenID: {brand.tokenID}</div>
                <div style={{color: "#bbb"}}>tokenURI: {brand.tokenUri}</div>
              </div>
          )
        })}
      </div>

    </div>
  );

};

export default App;
