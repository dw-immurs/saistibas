import { initializeApp } from 'firebase/app';
import { getDatabase, ref, runTransaction, get } from 'firebase/database';

// TAVI FIREBASE CREDENTIALS
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
 */
export const submitGameResult = async (gameIndex, attempts, won) => {
  try {
    const statsRef = ref(database, `games/${gameIndex}/stats`);
    
    await runTransaction(statsRef, (current) => {
      if (!current) {
        current = {
          totalPlayers: 0,
          results: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
      }
      
      current.totalPlayers = (current.totalPlayers || 0) + 1;
      if (!current.results) current.results = {};
      current.results[attempts] = (current.results[attempts] || 0) + 1;
      
      return current;
    });
    
    console.log(`✅ Statistika saglabāta: Spēle #${gameIndex}, ${attempts} mēģinājumi`);
    return true;
  } catch (error) {
    console.error('❌ Kļūda saglabājot statistiku:', error);
    return false;
  }
};

/**
 * Iegūst spēles statistiku
 */
export const getGameStats = async (gameIndex) => {
  try {
    const statsRef = ref(database, `games/${gameIndex}/stats`);
    const snapshot = await get(statsRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return {
        totalPlayers: 0,
        results: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }
  } catch (error) {
    console.error('❌ Kļūda iegūstot statistiku:', error);
    return null;
  }
};

/**
 * Aprēķina spēles grūtības pakāpi (1-5 ⭐)
 */
export const calculateDifficulty = (results) => {
  const total = Object.values(results).reduce((sum, count) => sum + count, 0);
  
  if (total === 0) return 3.0;
  
  // Aprēķina vidējo mēģinājumu skaitu
  let weightedSum = 0;
  Object.entries(results).forEach(([attempts, count]) => {
    weightedSum += parseInt(attempts) * count;
  });
  const avgAttempts = weightedSum / total;
  
  // Atgriež precīzu vidējo vērtību (1.0 - 5.0)
  return Math.min(5.0, Math.max(1.0, avgAttempts));
};