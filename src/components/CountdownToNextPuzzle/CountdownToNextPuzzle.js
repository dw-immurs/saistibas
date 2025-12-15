import React from "react";
import Countdown from "react-countdown";
import { dateOfNextPuzzle } from "../../lib/time-utils";

// Renderer callback with condition
const renderer = ({ days, hours, minutes, seconds, completed }) => {
  //ChatGPT Assisted
  // Render a countdown
  if (completed) {
    return (
      <span className="font-[600]">
        Jau pieejama jauna spēle! Atsvaidzini pārlūkprogrammu!.
      </span>
    );
  }
const timeParts = [];

if (days > 0) {
  const dayForm = (days % 10 === 1 && days % 100 !== 11) ? "dienas" : "dienām";
  timeParts.push(`${days} ${dayForm}`);
}
if (hours > 0) {
  const hourForm = (hours % 10 === 1 && hours % 100 !== 11) ? "stundas" : "stundām";
  timeParts.push(`${hours} ${hourForm}`);
}
if (minutes > 0) {
  const minuteForm = (minutes % 10 === 1 && minutes % 100 !== 11) ? "minūtes" : "minūtēm";
  timeParts.push(`${minutes} ${minuteForm}`);
}

  // Create a sentence based on the time parts
  let timeLeftString = "Nākamās Saistības varēsi uzņemties pēc ";
  if (timeParts.length > 2) {
    timeLeftString += timeParts.slice(0, -1).join(", ");
    timeLeftString += ` un ${timeParts.slice(-1)}`;
  } else if (timeParts.length == 2) {
    timeLeftString += `${timeParts[0]} un ${timeParts[1]}`;
  } else {
    timeLeftString += timeParts[0];
  }
  // Create a sentence based on the time parts

  return <div>{timeLeftString}</div>;
};

function CountdownToNextPuzzle() {
  return (
    <div className="flex flex-row place-content-center mt-4">
      <Countdown
        className="text-lg text-gray-900"
        renderer={renderer}
        date={dateOfNextPuzzle}
        intervalDelay={1000}
      />
    </div>
  );
}

export default CountdownToNextPuzzle;
