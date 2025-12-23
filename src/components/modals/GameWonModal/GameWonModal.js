import React from "react";
import BaseModal from "../BaseModal";

import { generateEmojiGrid } from "../../../lib/game-helpers";
import ShareScoreButton from "../../ShareScoreButton";
import CountdownToNextPuzzle from "../../CountdownToNextPuzzle";
import { PuzzleDataContext } from "../../../providers/PuzzleDataProvider";

function GameWonModal({ open, onClose, submittedGuesses, mode = "daily", puzzleLabel }) {
  const { gameData } = React.useContext(PuzzleDataContext);

  const title =
    mode === "archive"
      ? `Apsveicam! Tu atminēji Saistības ${puzzleLabel ?? ""}!`
      : "🎄🎄🎄 Ziemasvētku Saistības atrisinātas!"
      //: "Apsveicam! Tu atminēji šodienas Saistības!";

  const message =
    mode === "archive"
      ? (
      <>
      <p>Lielisks veikums! Vari uzspēlēt {" "}
  <span
  className="underline cursor-pointer"
  onClick={() => {
    onClose?.(); // aizver GameWon (caur Game.js state)
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("open-archive"));
    }, 0);
  }}
>
  citu arhīva spēli
  </span>{" "}
    vai doties uz šodienas spēli.</p>
  <p> Apskaties rezultātus zemāk:</p>
</>
)
: (
  <>
    <p>
      {/* Lielisks veikums! Gaidot vari uzspēlēt {" "} */}
      Lai priecīgi svētki! Gaidot nākamās Saistības, vari uzspēlēt {" "}
      <span
        className="underline cursor-pointer"
    onClick={() => {
      onClose?.();
      window.dispatchEvent(new CustomEvent("open-archive"));
    }}
      >
        kādu arhīva spēli.
      </span>{" "}</p>
      <p> Apskaties rezultātus zemāk:</p>
    </>
    );
  return (
    <BaseModal
      title={title}
      initiallyOpen={open}
      footerElements={<ShareScoreButton />}
      showActionButton={false}
    >
      {message}
      <div className="justify-center">
        <span className="text-center whitespace-pre">
          {"\n"}
          {generateEmojiGrid(gameData, submittedGuesses)}
        </span>

        {/* Šis ir tikai šodienas spēlei, arhīvā nav jēgas skaitīt līdz “nākamajai” */}
        {mode !== "archive" && <CountdownToNextPuzzle />}
      </div>
    </BaseModal>
  );
}

export default GameWonModal;
