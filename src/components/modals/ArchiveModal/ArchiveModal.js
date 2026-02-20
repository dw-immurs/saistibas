import React from "react";
import { Calendar, CheckCircle2 } from "lucide-react";
import { addDays, format, isSameDay } from "date-fns";
import { lv } from "date-fns/locale";
import BaseModal from "../BaseModal";
import { firstGameDate, periodInDays, getIndex, getToday, setGameDate } from "../../../lib/time-utils";
import { getGameStats, calculateDifficulty } from "../../../lib/firebase";

function ArchiveModal() {
  const [completedGames, setCompletedGames] = React.useState(new Set());
  const [isOpen, setIsOpen] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [gameDifficulties, setGameDifficulties] = React.useState({});
  const [activeGameIndex, setActiveGameIndex] = React.useState(null);

  const today = getToday();
  const maxIndex = getIndex(today);

  // Funkcija, kas ielādē izspēlētās spēles no localStorage
  const loadCompletedGames = React.useCallback(() => {
    const completed = new Set();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('game_') && key.endsWith('_completed')) {
        const gameIndex = parseInt(key.match(/game_(\d+)_completed/)?.[1] || '0');
        if (gameIndex > 0) completed.add(gameIndex);
      }
    }
    setCompletedGames(completed);
    setRefreshKey(prev => prev + 1);
  }, []);

  // Ielādē sākumā
  React.useEffect(() => {
    loadCompletedGames();
  }, [loadCompletedGames]);

  // Atjauno, kad modālis atveras
React.useEffect(() => {
    if (isOpen) {
      loadCompletedGames();
      
      // Iegūstam aktuālo indeksu no localStorage
      const stored = localStorage.getItem("archiveGameIndex");
      // Ja stored nav, tad aktīvā ir maxIndex (jaunākā)
      setActiveGameIndex(stored ? parseInt(stored) : maxIndex);
      
      // Ielādē grūtības pakāpes visām spēlēm
      const loadDifficulties = async () => {
        const today = getToday();
        const maxIndex = getIndex(today);
        const difficulties = {};
        
        for (let i = 1; i <= maxIndex; i++) {
          const stats = await getGameStats(i);
          if (stats && stats.totalPlayers > 0) {
            difficulties[i] = calculateDifficulty(stats.results);
          }
        }
        
        setGameDifficulties(difficulties);
      };
      console.log("[ArchiveModal] isOpen -> true, loading difficulties");
      loadDifficulties();
    }
  }, [isOpen, loadCompletedGames, maxIndex]);

  // Klausās uz spēles pabeigšanas eventu
  React.useEffect(() => {
    const handleGameComplete = () => {
      setTimeout(() => {
        loadCompletedGames();
      }, 100);
    };
    
    window.addEventListener('gameCompleted', handleGameComplete);
    return () => window.removeEventListener('gameCompleted', handleGameComplete);
  }, [loadCompletedGames]);

  React.useEffect(() => {
    const handler = () => {
      document.querySelector("[data-archive-trigger]")?.click();
    };

    window.addEventListener("open-archive", handler);
    return () => window.removeEventListener("open-archive", handler);
  }, []);
  
  // Funkcija, kas pārbauda, vai spēle ir izspēlēta un vai tā uzvarēta
  const getGameStatus = (gameIndex) => {
    const isCompleted = completedGames.has(gameIndex);
    if (!isCompleted) return { isCompleted: false, isWon: false };
    
    const wonStatus = localStorage.getItem(`game_${gameIndex}_won`);
    return { 
      isCompleted: true, 
      isWon: wonStatus === "true" 
    };
  };
  
  // Ģenerē visu pieejamo spēļu sarakstu
  const games = [];
  for (let i = 1; i <= maxIndex; i++) {
    const gameDate = addDays(firstGameDate, (i - 1) * periodInDays);
    const { isCompleted, isWon } = getGameStatus(i);
    const isToday = isSameDay(gameDate, today);
    const isLatestGame = i === maxIndex; // Jaunākā pieejamā spēle
    
    games.push({ 
      index: i, 
      date: gameDate,
      dateString: format(gameDate, 'd.M.yyyy'),
      isCompleted,
      isWon,
      isToday,
      isLatestGame
    });
  }

 const handleGameSelect = (game) => {
    const storedArchiveIndex = localStorage.getItem("archiveGameIndex");
    const currentActiveIndex = storedArchiveIndex ? parseInt(storedArchiveIndex) : maxIndex;

    const isCurrentGame = storedArchiveIndex 
      ? parseInt(storedArchiveIndex) === game.index 
      : game.isLatestGame;
    
    if (isCurrentGame) {
      setIsOpen(false);
      return;
    }

    // --- PROGRESA PĀRBAUDE ---
    let stateString = localStorage.getItem(`game_${currentActiveIndex}_state`);
    if (!stateString) {
      stateString = localStorage.getItem('gameState');
    }

    if (stateString) {
      try {
        const state = JSON.parse(stateString);
        
        // Pārbaudām gan 'guesses', gan tavu minēto 'submittedGuesses'
        const guesses = state.submittedGuesses || state.guesses || [];
        const hasGuesses = guesses.length > 0;
        
        // Pārbaudām, vai spēle jau nav beigusies
        const isEnded = state.gameStatus === 'WON' || state.gameStatus === 'LOST' || state.success === true;

        if (hasGuesses && !isEnded) {
          const confirm = window.confirm(
            "Aktīvā spēle tiks aizvērta un progress tiks dzēsts. Vai tiešām vēlies to aizvērt?"
          );
          if (!confirm) return; // Ja nospiež 'Atcelt', nekas nenotiek
        }
      } catch (e) {
        console.error("Kļūda nolasot spēles stāvokli:", e);
      }
    }
    // --- PĀRBAUDES BEIGAS ---

    // Tālāk seko tava esošā loģika par spēles ielādi...
    if (game.isLatestGame && game.isCompleted) {
      const confirm = window.confirm("Jaunākā spēle jau ir izspēlēta! Vai tiešām vēlies spēlēt vēlreiz?");
      if (!confirm) return;
      // ... (tavs dzēšanas kods)
    }

    // Pārējā ielādes daļa
    localStorage.removeItem('gameState');
    if (game.isLatestGame) {
      window.history.replaceState(null, "", window.location.pathname);
      localStorage.removeItem("archiveGameIndex");
    } else {
      localStorage.setItem("archiveGameIndex", String(game.index));
      const iso = format(game.date, "yyyy-MM-dd");
      window.history.replaceState(null, "", `?d=${iso}`);
    }
    window.location.reload();
  };

  const completedCount = games.filter(g => g.isCompleted).length;
  const wonCount = games.filter(g => g.isCompleted && g.isWon).length;
  const winRate = completedCount > 0 ? Math.round((wonCount / completedCount) * 100) : 0;

  return (
    <BaseModal
      open={isOpen}
      onOpenChange={(open) => {
        console.log("[ArchiveModal] onOpenChange:", open);
        setIsOpen(open);
      }}
      title="Spēļu arhīvs"
      trigger={
        <span
          data-archive-trigger
          onClick={() => {
            console.log("[ArchiveModal] trigger clicked");
            setIsOpen(true);
          }}
        >
          <Calendar />
        </span>
      }
      initiallyOpen={false}
      actionButtonText="Aizvērt"
    >
      <div className="space-y-2">
        <div className="text-sm text-gray-600 mb-4 space-y-1">
          <div>Kopā pieejamas {maxIndex} spēles</div>
          <div>Izspēlētas {completedCount} spēles</div>
          {completedCount > 0 && (
            <div className="font-semibold">
              Uzvarētas {wonCount}/{completedCount} ({winRate}%)
            </div>
          )}
        </div>
        
        <div className="max-h-96 overflow-y-auto space-y-2 px-2">
  {/* Izveidojam kopiju pirms reverse, lai nesabojātu games masīvu */}
  {[...games].reverse().map(game => {
    // Pārbauda, vai šī spēle ir pašlaik aktīvā, izmantojot state
    const isCurrentGame = activeGameIndex === game.index;
    
    return (
      <div
        key={game.index}
        onClick={() => handleGameSelect(game)}
        className={`w-full text-left px-4 py-3 rounded-lg border transition-colors cursor-pointer
          ${game.isCompleted && game.isWon
            ? 'bg-green-50 border-green-300 hover:border-green-400' 
            : game.isCompleted && !game.isWon
            ? 'bg-red-50 border-red-300 hover:border-red-400'
            : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
          }
          ${isCurrentGame ? 'ring-2 ring-blue-400 border-blue-400' : ''}
        `}
      >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    Spēle #{game.index}
                  </span>
                  {game.isCompleted && game.isWon && (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  )}
                  {game.isCompleted && !game.isWon && (
                    <span className="text-red-600 text-sm">✗</span>
                  )}
                  {game.isLatestGame && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      Jaunākā
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {gameDifficulties[game.index] && (
                    <span className="text-sm font-semibold text-gray-700" title="Grūtības pakāpe">
                      {gameDifficulties[game.index].toFixed(1)}
                    </span>
                  )}
                  <span className="text-sm text-gray-600">
                    {game.dateString}
                  </span>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </BaseModal>
  );
}

export default ArchiveModal;