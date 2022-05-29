import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';

const BrandCard = (props) => {
  // Add components in the component folder

  const history = useHistory();

  const toBrand = (_tokenID) => {
     history.push(`/brands/${_tokenID}`);
  }

  return (
         <div className="max-w-xs rounded-md shadow-md bg-gray-900 text-gray-100 ">
            <img src={props.logo} alt="" className="object-cover object-center w-full rounded-t-md h-72 bg-gray-500" />
            <div className="flex flex-col justify-between p-6 space-y-8">
               <div className="space-y-2">
                  <h2 className="text-3xl font-semibold tracking-wide">{props.name}</h2>
                  <p className="text-gray-100">{props.description}</p>
               </div>
               <button type="button" onClick={(e) => toBrand(props.tokenID)} className="flex items-center justify-center w-full p-3 font-semibold tracking-wide rounded-md bg-green-400 text-gray-900">
                  Open NFT
               </button>
            </div>
         </div>
   );
};

export default BrandCard;
