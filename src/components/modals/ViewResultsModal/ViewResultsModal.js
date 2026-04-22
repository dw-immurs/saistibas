import React from "react";

import { generateEmojiGrid } from "../../../lib/game-helpers";
import CountdownToNextPuzzle from "../../CountdownToNextPuzzle";
import ShareScoreButton from "../../ShareScoreButton";
import BaseModal from "../BaseModal";
import { GameStatusContext } from "../../../providers/GameStatusProvider";
import { PuzzleDataContext } from "../../../providers/PuzzleDataProvider";
import { Button } from "../../ui/button";

function ViewResultsModal() {
  const { submittedGuesses } = React.useContext(GameStatusContext);
  const { gameData } = React.useContext(PuzzleDataContext);

  return (
    <BaseModal
      title=""
      trigger={<span className="text-white inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-solid bg-neutral-800 basis-1/2 hover:bg-neutral-800/80 h-10 px-4 py-2 w-full">Skatīt rezultātus!</span>}
      triggerWrapperClass="w-full"
      initiallyOpen={false}
      showActionButton={false}
      footerElements={<ShareScoreButton buttonText={"Dalies ar rezultātiem!"} />}
    >
      <div className="flex flex-col place-content-center">
        <p className="text-center font-[600]">
          Tavi minējumi redzami zemāk
        </p>
        <span className="text-center whitespace-pre mb-2">
          {"\n"}
          {generateEmojiGrid(gameData, submittedGuesses)}
        </span>
        <CountdownToNextPuzzle />
      </div>
    </BaseModal>
  );
}

export default ViewResultsModal;
