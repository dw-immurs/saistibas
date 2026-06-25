import React from "react";
import InfoModal from "../modals/InfoModal";
import ArchiveModal from "../modals/ArchiveModal";
import logo from "url:../../assets/favicon_medium.png"; // Note the "url:" prefix
// import logo from "url:../../assets/christmas_favicon_medium.png";

function Header() {
  const isSpecialVersion = window.location.pathname.includes('/special');

  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-2">
      <div className="flex items-center gap-2">
        <img 
          src={logo}
          alt="Saistības logo" 
          className="h-8 w-8 sm:h-10 sm:w-10"
        />
      </div>
      
      <h1 className="font-space-mono text-lg sm:text-xl whitespace-nowrap">
        Saistības
      </h1>
      
      <div className="flex items-center gap-6 justify-end">
        {!isSpecialVersion && <ArchiveModal />}
        <InfoModal />
      </div>
    </header>
  );
}
export default Header;