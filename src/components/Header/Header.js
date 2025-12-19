import React from "react";

import InfoModal from "../modals/InfoModal";
import ArchiveModal from "../modals/ArchiveModal";

function Header() {
  return (
    <header>
      <h1 className="font-space-mono">Saistības</h1>
      <ArchiveModal isOpen={true} />
      <InfoModal />
    </header>
  );
}

export default Header;