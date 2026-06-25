import React from "react";
import Header from "../Header";
import Game from "../Game";

import { Toaster } from "../ui/toaster";
import PuzzleDataProvider from "../../providers/PuzzleDataProvider";
import GameStatusProvider from "../../providers/GameStatusProvider";
import Footer from "../Footer";

function App() {
  // Pārbaudiet, vai ir special versija
  const isSpecialVersion = window.location.pathname.includes('/special');

  return (
    <PuzzleDataProvider isSpecialVersion={isSpecialVersion}>
      <GameStatusProvider isSpecialVersion={isSpecialVersion}>
        <div className="wrapper">
          <Toaster />
          <Header />
          <Game />
          <Footer />
        </div>
      </GameStatusProvider>
    </PuzzleDataProvider>
  );
}

export default App;