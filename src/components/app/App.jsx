import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Game from '../game/Game';
import Header from '../header/Header';
import Pre from '../pre/Pre';
import abiData from '../../GuessTheNumberGame.json';

const abi = abiData[0].abi;

// const ownerContract1 = '0xb31c3d4dc7e3a28225b75ef8311e2a88db55cef5';
const ownerContract = '0x0084Bf966Ff9E3a4B0BC8855B142Fc183A7A8597';
let provider = new ethers.BrowserProvider(window.ethereum);
let signer = await provider.getSigner();
let contract = new ethers.Contract(ownerContract, abi, signer);

function App() {
   const [accounts, setAccounts] = useState(null);
   const [isOwner, setIsOwner] = useState(false);
   const [timestamp, setTimestamp] = useState(null);
   const [submissionPeriod, setSubmissionPeriod] = useState(null);

   // connect Metamask
   const connectMetamask = async () => {
      // asking if metamask is already present or not
      if (window.ethereum) {
         // fetching wallets (accounts)
         const accounts = await provider.send('eth_requestAccounts', []);
         setAccounts(accounts);
      } else {
         alert('Install metamask extension!');
      }
   };

   // start game (owner's right)
   const startGame = async () => {
      await contract.startGame();
      const period = await contract.submissionPeriod();
      provider.on('GameStarted', (event) => {
         console.log(event)
      });
   };

   useEffect(() => {
      // check for owner
      accounts && accounts.some((acc) => acc == ownerContract)
         ? setIsOwner(true)
         : setIsOwner(false);
   }, [accounts]);

   return (
      <div className="container">
         <Header connect={connectMetamask} />
         <Pre />
         <Game isOwner={isOwner} start={startGame} submissionPeriod={submissionPeriod} />
      </div>
   );
}

export default App;
