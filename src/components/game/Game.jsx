import React, { useEffect, useState } from 'react';

function Game({ isOwner, start, submissionPeriod }) {
   const [timer, setTimer] = useState(submissionPeriod);
     useEffect(() => {
        while (timer > 0) {
           const interval = setInterval(() => {
              setTimer((prev) => prev - 1);
           }, 1000);

           return () => clearInterval(interval);
        }
     }, [timer]);
   return (
      <>
         {/* startGameButton is available only for the contract's owner  */}
         <button id="startGameButton" style={{ display: 'flex' }} onClick={start}>
            Start Game
         </button>
         <div id="submissionTitle" style={{ display: 'block' }}>
            SUBMISSION PHASE IS OPEN
         </div>
         <div id="revealTitle" style={{ display: 'block' }}>
            REVEAL PHASE IS OPEN
         </div>
         <div id="countdownTimer" style={{ display: 'block' }}>
            1
         </div>
         <div className="input-container">
            <input
               id="guessInput"
               type="password"
               placeholder="Your guess"
               disabled
               style={{ display: 'block' }}
            />
            <i className="fas fa-eye" id="toggleGuessVisibility" style={{ display: 'block' }}></i>
            <p id="guessError" style={{ color: 'red', display: 'block' }}>
               This input is too large
            </p>
         </div>
         <div className="input-container">
            <input
               id="saltInput"
               type="password"
               placeholder="Your salt"
               disabled
               style={{ display: 'block' }}
            />
            <i className="fas fa-eye" id="toggleSaltVisibility" style={{ display: 'block' }}></i>
         </div>
         <button id="enterGuessButton" disabled style={{ display: 'block' }}>
            Submit your guess
         </button>

         {/*  startGameButton is available only for the contract's owner   */}
         <button id="calculateWinningGuessButton" disabled style={{ display: 'block' }}>
            Calculate winning guess
         </button>
         <button id="selectWinnerButton" disabled style={{ display: 'block' }}>
            Select winner
         </button>
      </>
   );
}

export default Game;
