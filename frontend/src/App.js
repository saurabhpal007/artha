import './styles/App.css';
import React from "react";


const App = () => {
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  // Add components in the component folder

  return (
    <div className="App">
      <h1> Start App here </h1>
      
      {renderNotConnectedContainer()}
    </div>
  );
};

export default App;
