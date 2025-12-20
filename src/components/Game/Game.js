import React from "react";
import { shuffleGameData } from "../../lib/game-helpers";
import GameGrid from "../GameGrid";
import NumberOfMistakesDisplay from "../NumberOfMistakesDisplay";
import GameLostModal from "../modals/GameLostModal";
import GameWonModal from "../modals/GameWonModal";

import { Separator } from "../ui/separator";
import ConfettiExplosion from "react-confetti-explosion";

import { PuzzleDataContext } from "../../providers/PuzzleDataProvider";
import { GameStatusContext } from "../../providers/GameStatusProvider";
import GameControlButtonsPanel from "../GameControlButtonsPanel";

import ViewResultsModal from "../modals/ViewResultsModal";

function Game() {
  const searchParams = new URLSearchParams(window.location.search);
  const archiveDate = searchParams.get("d");
  const isArchiveGame = Boolean(archiveDate);

  const archiveIndex = localStorage.getItem("archiveGameIndex");

  const puzzleLabel =
    isArchiveGame && archiveIndex
      ? `#${archiveIndex}`
      : null;

  const { gameData, categorySize, numCategories } =
    React.useContext(PuzzleDataContext);
  const { submittedGuesses, solvedGameData, isGameOver, isGameWon } =
    React.useContext(GameStatusContext);

  const [shuffledRows, setShuffledRows] = React.useState(
    shuffleGameData({ gameData })
  );
  const [isEndGameModalOpen, setIsEndGameModalOpen] = React.useState(false);
  const [gridShake, setGridShake] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);

  // use effect to update Game Grid after a row has been correctly solved
  React.useEffect(() => {
    const categoriesToRemoveFromRows = solvedGameData.map(
      (data) => data.category
    );
    const dataLeftForRows = gameData.filter((data) => {
      return !categoriesToRemoveFromRows.includes(data.category);
    });
    if (dataLeftForRows.length > 0) {
      setShuffledRows(shuffleGameData({ gameData: dataLeftForRows }));
    }
  }, [solvedGameData]);

  // Handle End Game!
React.useEffect(() => {
  if (!isGameOver) {
    return;
  }
  
  // Saglabā spēles statusu localStorage
  const searchParams = new URLSearchParams(window.location.search);
  const archiveDate = searchParams.get("d");
  const archiveIndex = localStorage.getItem("archiveGameIndex");
  
  let gameIndex;
  if (archiveDate && archiveIndex) {
    gameIndex = parseInt(archiveIndex);
  } else {
    const { getIndex, getToday } = require("../../lib/time-utils");
    gameIndex = getIndex(getToday());
  }
  
  console.log("Saving game - gameIndex:", gameIndex, "isGameWon:", isGameWon);

  // Saglabā, ka spēle ir izspēlēta
  localStorage.setItem(`game_${gameIndex}_completed`, "true");
  localStorage.setItem(`game_${gameIndex}_won`, isGameWon ? "true" : "false");

// Paziņo ArchiveModal, ka spēle ir pabeigta
window.dispatchEvent(new Event('gameCompleted'));
  const modalDelay = isGameWon ? 2000 : 250;
  const delayModalOpen = window.setTimeout(() => {
      setIsEndGameModalOpen(true);
      //unmount confetti after modal opens
      setShowConfetti(false);
    }, modalDelay);

    if (isGameWon) {
      setShowConfetti(true);
    }

    return () => window.clearTimeout(delayModalOpen);
  }, [isGameOver]);

  return (
    <>
      <h3 className="text-xl text-center mt-4">
        Izveido {numCategories} grupas ar {categorySize} kartītēm
      </h3>

      <div className={`game-wrapper`}>
{isGameOver && isGameWon ? (
          <GameWonModal
            open={isEndGameModalOpen}
            onClose={() => setIsEndGameModalOpen(false)}
            submittedGuesses={submittedGuesses}
            mode={isArchiveGame ? "archive" : "daily"}
            puzzleLabel={puzzleLabel}
  />
) : (
          <GameLostModal
            open={isEndGameModalOpen}
            onClose={() => setIsEndGameModalOpen(false)}
            submittedGuesses={submittedGuesses}
            mode={isArchiveGame ? "archive" : "daily"}
            puzzleLabel={puzzleLabel}
          />
        )}
        <GameGrid
          gameRows={shuffledRows}
          shouldGridShake={gridShake}
          setShouldGridShake={setGridShake}
        />
        {showConfetti && isGameOver && (
          <div className="grid place-content-center">
            <ConfettiExplosion
              particleCount={100}
              force={0.8}
              duration={2500}
            />
          </div>
        )}
        <Separator />

        {!isGameOver ? (
          <>
            <NumberOfMistakesDisplay />
            <GameControlButtonsPanel
              shuffledRows={shuffledRows}
              setShuffledRows={setShuffledRows}
              setGridShake={setGridShake}
            />
          </>
        ) : (
          <ViewResultsModal />
        )}
      </div>
    </>
  );
}

export default Game;
