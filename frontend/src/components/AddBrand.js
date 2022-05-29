import React, { useState, useEffect } from "react";
import abi from '../utils/BrandNFT.json';
import { ethers } from 'ethers';
import { useHistory } from 'react-router-dom';

function makeStorageClient() {
  return new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDNlY0RlMjk3NDlFOWQ2OEU5NjBjNTkxYzVDRjY5MWE5Nzc2MTc2YzUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTM3MDY0MDAxMjQsIm5hbWUiOiJBcnRoYU5GVCJ9.A0FsT-Fl6cPwgOiVVt7beyAC1E3Rmm9SxfDTrikkB7g" });
}


const AddBrand = () => {
  // Render Methods

  const history = useHistory();

   const toBrandPage = () => {
      history.push("/allBrands/");
   }

  const contractAddress = "0x11e3D82ebED1E82dA57e2512554EDe03846A00bf";
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
        
        //navigate to All Brands page
        
        toBrandPage();

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
    <div>
    <div className="bg-gray-800 lg:pb-20">
      <header className="p-4 bg-gray-00 text-gray-100">
            <div className="container flex justify-between h-16 mx-auto">
               <div className="flex">
                  <a rel="noopener noreferrer" href="#" aria-label="Back to homepage" className="flex items-center p-2">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32" className="w-8 h-8 text-green-400">
                        <path d="M18.266 26.068l7.839-7.854 4.469 4.479c1.859 1.859 1.859 4.875 0 6.734l-1.104 1.104c-1.859 1.865-4.875 1.865-6.734 0zM30.563 2.531l-1.109-1.104c-1.859-1.859-4.875-1.859-6.734 0l-6.719 6.734-6.734-6.734c-1.859-1.859-4.875-1.859-6.734 0l-1.104 1.104c-1.859 1.859-1.859 4.875 0 6.734l6.734 6.734-6.734 6.734c-1.859 1.859-1.859 4.875 0 6.734l1.104 1.104c1.859 1.859 4.875 1.859 6.734 0l21.307-21.307c1.859-1.859 1.859-4.875 0-6.734z"></path>
                     </svg>
                     <h2 className="px-15 py-6 lg:p-10 text-3xl font-semibold rounded bg-grey-800 text-green-400">Artha.io</h2>
                  </a>
               </div>
               <button className="p-4 lg:hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-100">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
               </button>
            </div>
      </header>

      <section className="p-6 bg-gray-700 text-gray-300">
        <form className="container flex flex-col mx-auto space-y-12 ng-untouched ng-pristine ng-valid ">
          <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm bg-gray-900">
            <div className="space-y-2 col-span-full lg:col-span-1">
              <p className="font-medium text-2xl">General Inormation</p>
              <p className="text-xs">Let us know little bit about your Brand, this information will be used to create your Brand's NFT.</p>
            </div>
            <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
              <div className="col-span-full sm:col-span-3">
                <label for="brandname" className="text-sm">Brand Name</label>
                <input id="brandname" type="text" placeholder="Artha.io" className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-indigo-600 border-gray-300 text-gray-900" onChange={(e) => setBrandName(e.target.value)}/>
              </div>
              <div className="col-span-full sm:col-span-3">
                <label for="website" className="text-sm">Website</label>
                <input id="website" type="text" placeholder="www.Artha.io" className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-indigo-600 border-gray-300 text-gray-900" onChange={(e) => setBrandWebsite(e.target.value)}/>
              </div>
              <div className="col-span-full">
                <label for="description" className="text-sm">What do you offer?</label>
                <input id="description" type="text" placeholder="Web3 Marketplace for digital brands" className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-indigo-600 border-gray-300 text-gray-900" onChange={(e) => setBrandDescription(e.target.value)}/>
              </div>
              <div className="col-span-full">
                <label for="overview" className="text-sm">Describe Your Brand</label>
                <textarea id="overview" placeholder="Write about your mission, tell us what positions you uniquely in market" className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-indigo-600 border-gray-300 text-gray-900" onChange={(e) => setBrandWebsite(e.target.value)}></textarea>
              </div>
              <div className="col-span-full">
                <label for="logo" className="block text-sm font-medium">Add your Logo</label>
                <div className="flex">
                  <input type="file" name="logo" id="logo" className="px-8 py-12 border-2 border-dashed rounded-md border-gray-300 text-gray-600 bg-gray-100" onChange={(e) => uploadBrandLogo(e)}/>
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset className=" grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm bg-gray-900">
            <div className="space-y-2 col-span-full lg:col-span-1">
              <p className="font-medium text-2xl">Founder Information</p>
              <p className="text-xs">Whose genius went into this?</p>
            </div>
            <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
              <div className="col-span-full sm:col-span-3">
                <label for="username" className="text-sm">Name</label>
                <input id="username" type="text" placeholder="Username" className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-indigo-600 border-gray-300 text-gray-900" onChange={(e) => addBrandTeam()}/>
              </div>
              <div className="col-span-full sm:col-span-3">
                <label for="position" className="text-sm">Position</label>
                <input id="position" type="text" placeholder="CEO" className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-indigo-600 border-gray-300 text-gray-900" onChange={(e) => addBrandTeam()}/>
              </div>
              <div className="col-span-full">
                <label for="bio" className="text-sm">Tell us about yourself?</label>
                <textarea id="bio" placeholder="I am an exprienced founder..." className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-indigo-600 border-gray-300 text-gray-900" onChange={(e) => addBrandTeam()}></textarea>
              </div>
            </div>
          </fieldset>
        </form>
        <div className="flex justify-center lg:mt-5">
            <button type="button" className="px-8 py-3 content-center justify-center font-semibold rounded-full bg-green-400 text-gray-800" onClick={mintNFT}>Mint Brand NFT</button>
        </div>
        </section>
    </div>
    </div>
  );
};

export default AddBrand;
