import React from 'react';

function Header({connect}) {
   return (
      <div className="header">
         <button id="connectButton" onClick={connect}>
            <i className="fas fa-wallet"></i> Connect Metamask
         </button>
      </div>
   );
}

export default Header;
