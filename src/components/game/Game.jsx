import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import abiData from '../../GuessTheNumberGame.json';
import { getItem, setItem } from '../../helpers/localStorage';

const contractAddress = '0x0084Bf966Ff9E3a4B0BC8855B142Fc183A7A8597';
const abi = abiData[0].abi;

function Game({
   isOwner,
   start,
   account,
   submission,
   reveal,
   isSubmission,
   setIsSubmission,
   setSubmission,
   setReveal,
}) {
   const [isCalculated, setIsCalculated] = useState(getItem('isCalculated'));
   const [isRevealSubmitted, setIsRevealSubmitted] = useState(getItem('isRevealSubmitted'));
   const [timer, setTimer] = useState(null);
   const [guess, setGuess] = useState('');
   const [salt, setSalt] = useState('');

   const handleGuess = (e) => {
      const value = e.target.value;
      setGuess(value);
   };

   const handleSalt = (e) => {
      const value = e.target.value;
      setSalt(value);
   };

   const enterGuess = async () => {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(abi, contractAddress);

      if (JSON.parse(isSubmission)) {
         const participationFee = await contract.methods.participationFee().call();
         contract.methods
            .enterGuess(Number(guess), Number(salt))
            .send({ from: account, gas: '1000000', value: participationFee });
      } else if (!JSON.parse(isSubmission)) {
         contract.methods
            .revealSaltAndGuess(Number(guess), Number(salt))
            .send({ from: account })
            .on('receipt', () => {
               setIsRevealSubmitted(true);
               setItem('isRevealSubmitted', true);
            });
      }
   };

   const calculateGuess = () => {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(abi, contractAddress);

      contract.events.WinningGuessCalculated().on('data', () => {
         setItem('isCalculated', true);
         setIsCalculated(getItem('isCalculated'));
      });

      contract.methods.calculateWinningGuess().send({ from: account, gas: '5000000' });
   };

   const selectWinner = () => {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(abi, contractAddress);
      if (isCalculated) {
         contract.methods.selectWinner().send({ from: account, gas: '5000000' });
      }
   };

   useEffect(() => {
      if (submission > 0) {
         setTimer(submission);
         setItem('isSubmission', true);
         setIsSubmission(getItem('isSubmission'));
      } else {
         setTimer(reveal);
         setItem('isSubmission', false);
         setIsSubmission(getItem('isSubmission'));
      }

      while (timer > 0) {
         const interval = setInterval(() => {
            if (submission == 0) {
               setItem('revealPeriod', timer - 1);
               setReveal(getItem('revealPeriod'));
               setTimer(getItem('revealPeriod'));
            } else {
               setItem('submissionPeriod', timer - 1);
               setSubmission(getItem('submissionPeriod'));
               setTimer(getItem('submissionPeriod'));
            }
         }, 1000);

         return () => clearInterval(interval);
      }
   }, [timer, isSubmission, reveal]);

   return (
      <>
         {/* startGameButton is available only for the contract's owner  */}
         <button
            id="startGameButton"
            style={{
               display: isOwner ? 'flex' : 'none',
            }}
            onClick={start}>
            Start Game
         </button>
         <div id="submissionTitle" style={{ display: submission > 0 ? 'block' : 'none' }}>
            SUBMISSION PHASE IS OPEN
         </div>
         <div
            id="revealTitle"
            style={{ display: !JSON.parse(isSubmission) && reveal > 0 ? 'block' : 'none' }}>
            REVEAL PHASE IS OPEN
         </div>
         <div id="countdownTimer" style={{ display: 'block' }}>
            {timer}
         </div>
         <div className="input-container">
            <input
               id="guessInput"
               type="password"
               placeholder="Your guess"
               disabled={isSubmission === 'null'}
               style={{
                  display: account ? 'block' : 'none',
               }}
               value={guess}
               onChange={handleGuess}
            />
            <i
               className="fas fa-eye"
               id="toggleGuessVisibility"
               style={{
                  display: account ? 'block' : 'none',
               }}></i>
            <p id="guessError"></p>
         </div>
         <div className="input-container">
            <input
               id="saltInput"
               type="password"
               placeholder="Your salt"
               disabled={isSubmission === 'null'}
               style={{
                  display: account ? 'block' : 'none',
               }}
               value={salt}
               onChange={handleSalt}
            />
            <i
               className="fas fa-eye"
               id="toggleSaltVisibility"
               style={{
                  display: account ? 'block' : 'none',
               }}></i>
            <p id="guessError"></p>
         </div>
         <button
            id="enterGuessButton"
            style={{
               display: account ? 'block' : 'none',
            }}
            onClick={enterGuess}>
            {submission > 0 ? 'Submit your guess' : reveal > 0 ? 'Reveal your guess' : ''}
         </button>

         {/*  startGameButton is available only for the contract's owner   */}
         <button
            id="calculateWinningGuessButton"
            style={{
               display:
                  isOwner && Number(reveal) === 0 && JSON.parse(isRevealSubmitted)
                     ? 'block'
                     : 'none',
            }}
            onClick={calculateGuess}>
            Calculate winning guess
         </button>
         <button
            id="selectWinnerButton"
            style={{ display: isOwner && JSON.parse(isCalculated) ? 'block' : 'none' }}
            onClick={selectWinner}>
            Select winner
         </button>
      </>
   );
}

export default Game;
