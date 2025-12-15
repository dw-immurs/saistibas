import React from "react";

import InfoModal from "../modals/InfoModal";

function Header() {
  return (
    <header>
      <h1 className="font-space-mono">Saistības</h1>
      <InfoModal />
    </header>
  );
}

export default Header;
