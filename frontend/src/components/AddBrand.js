import React, { useState, useEffect } from "react";
import { create } from "ipfs-http-client";
import abi from '../utils/BrandNFT.json';
import { ethers } from 'ethers';
import { Web3Storage, File } from 'web3.storage/dist/bundle.esm.min.js';


function makeStorageClient() {
  return new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDNlY0RlMjk3NDlFOWQ2OEU5NjBjNTkxYzVDRjY5MWE5Nzc2MTc2YzUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTM3MDY0MDAxMjQsIm5hbWUiOiJBcnRoYU5GVCJ9.A0FsT-Fl6cPwgOiVVt7beyAC1E3Rmm9SxfDTrikkB7g" });
}

const client = create("https://ipfs.infura.io:5001/api/v0");

const AddBrand = () => {
  // Render Methods

  const contractAddress = "0x1C53D4BdCe09827059046998b3832AB9Df00793A";
  const contractABI = abi.abi;

  const [logoUrl, setLogoUrl] = useState("");
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [brandOverview, setBrandOverview] = useState("");
  const [brandTeam, setBrandTeam] = useState([]);
  const [brandWebsite, setBrandWebsite] = useState("www.sample.com");

  const uploadBrandLogo = async (e) => {
    const file = e.target.files[0];
    try {
      const client = makeStorageClient();
      const cid = await client.put([file]);

      console.log('stored files with cid:', cid)
      var fullPath = e.target.value;

      var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
      var filename = fullPath.substring(startIndex);
      if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
        filename = filename.substring(1);
      }

      let url = `https://${cid}.ipfs.dweb.link/${filename}`;

      setLogoUrl(url);

    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  const addBrandTeam = () => {
    setBrandTeam([{"Saurabh": ""}, {"Deepak": ""}]);
  }

  function makeFileObjects(obj) {
    const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })
    const files = [
      new File([blob], `${obj.slugName}.json}`)
    ]
    return files
  } 

  const generateBrandMetadata = async () => {

    let jsonSchema = {
      slugName: brandName.split(" ").join("-"),
      brandName,
      brandDescription,
      brandOverview,
      logoUrl,
      brandTeam,
      brandWebsite
    };
    
    console.log(jsonSchema);

    // Call API to create brand
    const client = makeStorageClient();
    const cid = await client.put(makeFileObjects(jsonSchema));

    const metadata = `https://${cid}.ipfs.dweb.link/${jsonSchema.slugName}.json`;

    console.log(metadata);
    return metadata;

  }

  const mintNFT = async () => {

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const BrandNFTContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        const metadataURL = await generateBrandMetadata();
        console.log(metadataURL);
        const mintTxn = await BrandNFTContract.MintNFT(metadataURL);

        console.log("Mining...", mintTxn.hash);

        await mintTxn.wait();

        console.log("Mined...", mintTxn.hash);

        let lastestMint = await BrandNFTContract.latestMintAddress();
        console.log("Latest NFT minted by...", lastestMint);
      
      } else {
        console.log("Ethereum object doesn't exist.");
      }
    } catch (error) {
      console.log(error);
    }

    //reset react state variables
    setLogoUrl("https://via.placeholder.com/500x500.png?text=Logo+Full");
    setBrandName("");
    setBrandDescription("");
    setBrandOverview("");
    setBrandTeam([]);
    setBrandWebsite("www.sample.com");
  }

  return (
    <div className="mainContainer">
      <form>
        <h4>Brand Name</h4>
        <input type='text' placeholder="Brand Name" onChange={(e) => setBrandName(e.target.value)}></input>
        <h4>Brand Description</h4>
        <input type='text' placeholder="Brand Description" onChange={(e) => setBrandDescription(e.target.value)}></input>
        <h4>Your Website</h4>
        <input type='text' placeholder="Brand Website" onChange={(e) => setBrandWebsite(e.target.value)}></input>
        <h4>Your Team</h4>
        <input type='text' placeholder="Brand Team" onChange={(e) => addBrandTeam()}></input>
        <h4>Logo</h4>
        <input type='file' placeholder="Brand Logo" onChange={(e) => uploadBrandLogo(e)}></input>
      </form>

      <button onClick={mintNFT}>Mint Brand NFT</button>
    </div>
  );

};

export default AddBrand;
