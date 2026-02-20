import React from "react";
import {hyphenateSync as hyphenate} from "hyphen/lv";
import * as styles from "./WordButton.module.css";
import { Toggle } from "../ui/toggle";

import { GameStatusContext } from "../../providers/GameStatusProvider";

function WordButton({ word, fullCandidateSize }) {
  const { guessCandidate, setGuessCandidate } =
    React.useContext(GameStatusContext);
  const [isSelected, setIsSelected] = React.useState(
    !!guessCandidate.includes(word)
  );

  const isCandidateListFull = guessCandidate.length == fullCandidateSize;

  React.useEffect(() => {
    setIsSelected(!!guessCandidate.includes(word));
  }, [guessCandidate]);

  function flipSelection(nativeWord) {
    if (isSelected) {
      // remove from candidateGuess
      const updatedGuessCandidate = guessCandidate.filter((w) => {
        return w !== nativeWord;
      });
      setGuessCandidate(updatedGuessCandidate);
      // set state to *not* selected
      setIsSelected(false);
    } else {
      // check if the candidate array is full
      if (!isCandidateListFull) {
        // add to candidateGuess array
        setGuessCandidate([...guessCandidate, nativeWord]);
        // set state to *selected*
        setIsSelected(true);
      }
    }
  }

  const hyphenatedWord = hyphenate(word);

  // word = "washingtonian";
  return (
    <Toggle
      className={`${styles.growShrink} min-h-[2.5rem] select-none`}
      variant="outline"
      pressed={isSelected}
      onClick={() => flipSelection(word)}
    >
      <p
        className={`font-space-mono uppercase hyphens-manual leading-4 px-1`}
      >
        {hyphenatedWord}
      </p>
    </Toggle>
  );
}

export default WordButton;
