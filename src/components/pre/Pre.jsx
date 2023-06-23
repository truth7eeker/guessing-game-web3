import React from 'react';

function Pre() {
   return (
      <>
         <pre>
            <h1>Guessing Game</h1>
         </pre>
         <div className="rules">
            <p>Long time ago in the Ethereum universe...</p>
            <p>
               Only the master jedi can start the game, but every padavan can play. To join the
               quest, connect your wallet with Metamask. If the game has started, enter your guess
               and your salt, a mysterious number that makes your guess secure.
            </p>
            <p>
               Every player has one hour to submit the guess, and after that, one hour to reveal it.
               The force will be strong with the one who guesses right. The winner gets the prize,
               minus the master jedi's fee. May the force be with you.
            </p>
         </div>
      </>
   );
}

export default Pre;
