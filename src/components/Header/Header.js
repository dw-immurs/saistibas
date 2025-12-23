import React from "react";
import InfoModal from "../modals/InfoModal";
import ArchiveModal from "../modals/ArchiveModal";
// import logo from "../../../public/favicon_medium.png"; //parastais logo
import logo from "../../../public/christmas_favicon_medium.png"; //Ziemassvētku logo

function Header() {
  return (
    <header className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img 
          src={logo}
          alt="Saistības logo" 
          className="h-10 w-10"
        />
      </div>
      
      <h1 className="font-space-mono absolute left-1/2 -translate-x-1/2">
        Saistības🎄
      </h1>
      
      <div className="flex items-center gap-2">
        <ArchiveModal />
        <InfoModal />
      </div>
    </header>
  );
}

export default Header;