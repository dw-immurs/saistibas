import { initializeApp } from 'firebase/app';
import { getDatabase, ref, runTransaction, get } from 'firebase/database';

// ŠEIT IELIEC SAVUS FIREBASE CREDENTIALS NO 3. SOĻA!
const firebaseConfig = {
  apiKey: "AIzaSyAPKPBG_2JZ8Wqez2jN1P4lgxaczKSICLM",
  authDomain: "saistibas-108dd.firebaseapp.com",
  databaseURL: "https://saistibas-108dd-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "saistibas-108dd",
  storageBucket: "saistibas-108dd.firebasestorage.app",
  messagingSenderId: "600864340762",
  appId: "1:600864340762:web:8753c36c083bd077c98aa3",
  measurementId: "G-WYVL18JZ9B"
};

// Inicializē Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

/**
 * Saglabā spēles rezultātu statistikā
 * @param {number} gameIndex - Spēles numurs (1, 2, 3...)
 * @param {number} mistakes - Kļūdu skaits (0-4)
 * @param {boolean} won - Vai spēle tika uzvarēta
 */
export const submitGameResult = async (gameIndex, mistakes, won) => {
  try {
    const statsRef = ref(database, `games/${gameIndex}/stats`);
    
    await runTransaction(statsRef, (current) => {
      // Ja vēl nav datu, izveido sākuma struktūru
      if (!current) {
        current = {
          totalPlayers: 0,
          results: {
            0: 0, // 0 kļūdas - perfekti
            1: 0, // 1 kļūda
            2: 0, // 2 kļūdas
            3: 0, // 3 kļūdas
            4: 0  // 4 kļūdas - zaudēts
          }
        };
      }
      
      // Palielina spēlētāju skaitu
      current.totalPlayers = (current.totalPlayers || 0) + 1;
      
      // Palielina konkrētā kļūdu skaita statistiku
      if (!current.results) current.results = {};
      current.results[mistakes] = (current.results[mistakes] || 0) + 1;
      
      return current;
    });
    
    console.log(`✅ Statistika saglabāta: Spēle #${gameIndex}, ${mistakes} kļūdas`);
    return true;
  } catch (error) {
    console.error('❌ Kļūda saglabājot statistiku:', error);
    return false;
  }
};

/**
 * Iegūst spēles statistiku
 * @param {number} gameIndex - Spēles numurs
 * @returns {Promise<Object|null>} Statistikas objekts vai null
 */
export const getGameStats = async (gameIndex) => {
  try {
    const statsRef = ref(database, `games/${gameIndex}/stats`);
    const snapshot = await get(statsRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      // Ja vēl nav datu par šo spēli
      return {
        totalPlayers: 0,
        results: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 }
      };
    }
  } catch (error) {
    console.error('❌ Kļūda iegūstot statistiku:', error);
    return null;
  }
};

/**
 * Aprēķina spēles grūtības pakāpi (1.0-5.0)
 * Balstīts uz kļūdu skaitu: 0 kļūdas = 1.0, 4 kļūdas = 5.0
 * @param {Object} results - Rezultātu objekts { 0: count, 1: count, 2: count, 3: count, 4: count }
 * @returns {number} Grūtības pakāpe 1.0-5.0
 */
export const calculateDifficulty = (results) => {
  const total = Object.values(results).reduce((sum, count) => sum + count, 0);
  
  if (total === 0) return 3.0; // Nav datu - default vidēja
  
  // Aprēķina vidējo kļūdu skaitu
  let weightedSum = 0;
  Object.entries(results).forEach(([mistakes, count]) => {
    weightedSum += parseInt(mistakes) * count;
  });
  const avgMistakes = weightedSum / total;
  
  // Pārvērš kļūdas (0-4) par grūtības pakāpi (1.0-5.0)
  // 0 kļūdas → 1.0
  // 1 kļūda → 2.0
  // 2 kļūdas → 3.0
  // 3 kļūdas → 4.0
  // 4 kļūdas → 5.0
  return Math.min(5.0, Math.max(1.0, avgMistakes + 1));
};