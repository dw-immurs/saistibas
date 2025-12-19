import React from "react";
import { Calendar } from "lucide-react";
import { addDays, format } from "date-fns";
import { lv } from "date-fns/locale";
import BaseModal from "../BaseModal";
import { firstGameDate, periodInDays, getIndex, getToday, setGameDate } from "../../../lib/time-utils";

function ArchiveModal() {
  React.useEffect(() => {
    const handler = () => {
      document.querySelector("[data-archive-trigger]")?.click();
    };

    window.addEventListener("open-archive", handler);
    return () => window.removeEventListener("open-archive", handler);
  }, []);

  const today = getToday();
  const maxIndex = getIndex(today);
  
  // Ģenerē visu pieejamo spēļu sarakstu
  const games = [];
  for (let i = 1; i <= maxIndex; i++) {
    const gameDate = addDays(firstGameDate, (i - 1) * periodInDays);
    games.push({ 
      index: i, 
      date: gameDate,
      dateString: format(gameDate, 'd.M.yyyy')
    });
  }

    const handleGameSelect = (game) => {
  // saglabā index (lai Game.js var uztaisīt "Spēle #N")
        localStorage.setItem("archiveGameIndex", String(game.index));

  // uzliek URL parametru, lai Game.js redz, ka tas ir arhīvs
        const iso = format(game.date, "yyyy-MM-dd");
        window.history.replaceState(null, "", `?d=${iso}`);

  // esošā loģika – iestata spēles datumu
  setGameDate(game.date);
};

  return (
    <BaseModal
        title="Spēļu arhīvs"
        trigger={
            <span data-archive-trigger>
                <Calendar className="mr-4" />
            </span>
        } 
        initiallyOpen={false}
      actionButtonText="Aizvērt"
    >
      <div className="space-y-2">
        <p className="text-sm text-gray-600 mb-4">
          Kopā pieejamas {maxIndex} spēles
        </p>
        
        <div className="max-h-96 overflow-y-auto space-y-2">
          {games.reverse().map(game => (
            <button
              key={game.index}
              onClick={() => handleGameSelect(game)}
              className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  Spēle #{game.index}
                </span>
                <span className="text-sm text-gray-600">
                  {game.dateString}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </BaseModal>
  );
}

export default ArchiveModal;