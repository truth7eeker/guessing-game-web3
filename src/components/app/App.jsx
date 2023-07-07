import { useState } from 'react';
import Web3 from 'web3';
import Game from '../game/Game';
import Header from '../header/Header';
import Pre from '../pre/Pre';
import abiData from '../../GuessTheNumberGame.json';
import { getItem, setItem, removeItem } from '../../helpers/localStorage';

const contractAddress = '0x0084Bf966Ff9E3a4B0BC8855B142Fc183A7A8597';
const abi = abiData[0].abi;

function App() {
   const [account, setAccount] = useState(getItem('account'));
   const [isOwner, setIsOwner] = useState(JSON.parse(getItem('isOwner')));
   const [submission, setSubmission] = useState(getItem('submissionPeriod'));
   const [isSubmission, setIsSubmission] = useState(JSON.parse(getItem('isSubmission')));
   const [reveal, setReveal] = useState(getItem('revealPeriod'));

   // connect Metamask
   const connectMetamask = async () => {
      if (window.ethereum) {
         // fetching wallets (accounts)
         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
         setItem('account', accounts[0]);
         setAccount(accounts[0]);
         // check for owner
         const web3 = new Web3(window.ethereum);
         const contract = new web3.eth.Contract(abi, contractAddress);
         const owner = await contract.methods.owner().call();

         if (accounts[0].toLowerCase() === owner.toLowerCase()) {
            setItem('isOwner', true);
            setIsOwner(true);
         }
      }
   };

   // start game (owner's right)
   const startGame = async () => {
      // reset localStorage
      resetGame();

      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(abi, contractAddress);

      // Listen for GameStarted event
      contract.events.GameStarted().on('data', async () => {
         const submissionPeriod = await contract.methods.submissionPeriod().call();
         const revealPeriod = await contract.methods.revealPeriod().call();

         setItem('submissionPeriod', Number(submissionPeriod));
         setItem('revealPeriod', Number(revealPeriod));
         setItem('isSubmission', true);

         setSubmission(Number(submissionPeriod));
         setReveal(Number(revealPeriod));
         setIsSubmission(true);
      });

      contract.methods.startGame().send({ from: account });
   };

   const resetGame = () => {
      removeItem('revealPeriod');
      removeItem('submissionPeriod');
      removeItem('isSubmission');
      removeItem('isCalculated');
      removeItem('isGuessSubmitted');
      removeItem('isRevealSubmitted');
   };

   return (
      <div className="container">
         <Header connect={connectMetamask} />
         <Pre />
         <Game
            isOwner={isOwner}
            account={account}
            start={startGame}
            submission={submission}
            reveal={reveal}
            isSubmission={isSubmission}
            setIsSubmission={setIsSubmission}
            setReveal={setReveal}
            setSubmission={setSubmission}
         />
      </div>
   );
}

export default App;
