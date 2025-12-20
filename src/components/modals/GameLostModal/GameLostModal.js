import React from "react";
import BaseModal from "../BaseModal";
import { SolvedWordRow } from "../../GameGrid";
import ShareScoreButton from "../../ShareScoreButton";
import CountdownToNextPuzzle from "../../CountdownToNextPuzzle";
import { PuzzleDataContext } from "../../../providers/PuzzleDataProvider";

function GameLostModal({   open, onClose,
  submittedGuesses,
  mode = "daily",
  puzzleLabel }) {
  const { gameData } = React.useContext(PuzzleDataContext);

  const title =
    mode === "archive"
      ? `Diemžēl netiki galā ar Saistībām ${puzzleLabel ?? ""}...`
      : "Diemžēl Saistības bija pārāk lielas...";

  const message =
    mode === "archive"
     ? (
  <>
    <p>
      Nekas — vari uzspēlēt{" "}
      <span
        className="underline cursor-pointer"
        onClick={() => {
          onClose?.();
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("open-archive"));
          }, 0);
        }}
      >
        citu arhīva spēli
      </span>{" "}
      vai doties uz šodienas spēli.
    </p>
    <p>Apskaties rezultātus zemāk:</p>
  </>
)
: (
  <>
    <p>
  Nekas — gaidot vari uzspēlēt {" "}
  <span
    className="underline cursor-pointer"
onClick={() => {
  onClose?.();
  window.dispatchEvent(new CustomEvent("open-archive"));
}}
  >
    kādu arhīva spēli.
  </span>{" "} </p>
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
        {gameData.map((obj) => (
          <SolvedWordRow key={obj.category} {...obj} />
        ))}
        </span>
        {/* Šis ir tikai šodienas spēlei, arhīvā nav jēgas skaitīt līdz “nākamajai” */}
        {mode !== "archive" && <CountdownToNextPuzzle />}
      </div>

    </BaseModal>
  );
}

export default GameLostModal;