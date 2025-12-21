/**
 * MAIN.JS
 * Point d'entrée.
 */

import { loadGame, saveGame, resetGame } from './storage.js';
import * as Actions from './actions.js';
import { updateButtons } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    
    loadGame();

    // --- 2. ÉVÉNEMENTS (CLICS) ---
    
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    
    document.getElementById('MakeCaps').addEventListener('click', () => Actions.makeCaps(1));
    
    document.getElementById('btnLowerPrice').addEventListener('click', Actions.lowerPrice);
    document.getElementById('btnRaisePrice').addEventListener('click', Actions.raisePrice);
    document.getElementById('BuyAutoCapser').addEventListener('click', Actions.buyAutoCapser);
    document.getElementById('btnExpandMarketing').addEventListener('click', Actions.buyAds);

    document.getElementById('btnBuyCPU').addEventListener('click', Actions.buyCPU);
    document.getElementById('btnBuyRAM').addEventListener('click', Actions.buyRAM);
    
    // CORRECTION ICI : Appel de la nouvelle fonction
    document.getElementById('btnImproveAuto').addEventListener('click', Actions.buyImprovedAutoCapsers);


    // --- 3. BOUCLES DE JEU (LOOPS) ---
    
    setInterval(() => {
        Actions.autoGenerateCaps();
        Actions.autoSell();
    }, 1000);

    setInterval(() => {
        Actions.processOps();     
        Actions.checkProjects();  
    }, 1000);

    setInterval(() => {
        Actions.calculatePublicDemand();
        updateButtons();
    }, 200);

    setInterval(saveGame, 5000);

});