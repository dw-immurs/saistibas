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

  function flipSelection() {
    if (isSelected) {
      // remove from candidateGuess
      const updatedGuessCandidate = guessCandidate.filter((w) => {
        return w !== word;
      });
      setGuessCandidate(updatedGuessCandidate);
      // set state to *not* selected
      setIsSelected(false);
    } else {
      // check if the candidate array is full
      if (!isCandidateListFull) {
        // add to candidateGuess array
        setGuessCandidate([...guessCandidate, word]);
        // set state to *selected*
        setIsSelected(true);
      }
    }
  }

  //const fontSizeByWordLength = 9characters works with 0.6rem

  function getFontSize(word) {
    const baseLength = 9;
    const wordLength = word.length;
    let fontSize = 1;
    if (wordLength > baseLength) {
      const numExtraChars = wordLength - baseLength;
      fontSize = fontSize - numExtraChars * 0.1;
      fontSize = Math.max(0.5, fontSize);
      return fontSize >= 0.8 ? `${fontSize}em` : null;
    } else {
      return null;
    }
  }

  word = hyphenate(word);

  // word = "washingtonian";
  return (
    <Toggle
      className={`${styles.growShrink} min-h-[2.5rem] select-none`}
      variant="outline"
      pressed={isSelected}
      onClick={flipSelection}
    >
      <p
        style={{ fontSize: getFontSize(word) }}
        className={`font-space-mono uppercase sm:text-xs md:text-xs hyphens-manual`}
      >
        {word}
      </p>
    </Toggle>
  );
}

export default WordButton;
