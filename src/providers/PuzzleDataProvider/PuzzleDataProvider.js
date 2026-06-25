import React from "react";
import * as normalUtils from "../../lib/time-utils";
import * as specialUtils from "../../lib/time-utils-special";

export const PuzzleDataContext = React.createContext();

function PuzzleDataProvider({ children, isSpecialVersion = false }) {
  // Atlasiet pareizos time-utils
  const timeUtils = isSpecialVersion ? specialUtils : normalUtils;
  
  const [gameData, setGameData] = React.useState(timeUtils.puzzleAnswers);
  const categorySize = gameData?.[0]?.words?.length || 0;
  const numCategories = gameData.length;
  
  return (
    <PuzzleDataContext.Provider
      value={{ 
        gameData, 
        numCategories, 
        categorySize, 
        isSpecialVersion,
        timeUtils
      }}
    >
      {children}
    </PuzzleDataContext.Provider>
  );
}

export default PuzzleDataProvider;