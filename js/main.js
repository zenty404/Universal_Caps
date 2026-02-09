/**
 * MAIN.JS
 * Point d'entrée.
 */

import { loadGame, saveGame, resetGame } from './storage.js';
import * as Actions from './actions.js';
import { updateButtons } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {

    loadGame();

    // --- ÉVÉNEMENTS (CLICS) ---

    document.getElementById('resetBtn').addEventListener('click', resetGame);
    document.getElementById('MakeCaps').addEventListener('click', () => Actions.makeCaps(1));
    document.getElementById('btnLowerPrice').addEventListener('click', Actions.lowerPrice);
    document.getElementById('btnRaisePrice').addEventListener('click', Actions.raisePrice);
    document.getElementById('BuyAutoCapser').addEventListener('click', Actions.buyAutoCapser);
    document.getElementById('btnExpandMarketing').addEventListener('click', Actions.buyAds);
    document.getElementById('btnBuyCPU').addEventListener('click', Actions.buyCPU);
    document.getElementById('btnBuyRAM').addEventListener('click', Actions.buyRAM);
    document.getElementById('btnImproveAuto').addEventListener('click', Actions.buyImprovedAutoCapsers);

    // --- BOUCLES DE JEU ---

    let mainLoopId, fastLoopId, saveLoopId;

    function startLoops() {
        // Boucle principale (1s) : production, vente, ops, projets
        mainLoopId = setInterval(() => {
            Actions.autoGenerateCaps();
            Actions.autoSell();
            Actions.processOps();
            Actions.checkProjects();
        }, 1000);

        // Boucle rapide (200ms) : demande + mise à jour boutons
        fastLoopId = setInterval(() => {
            Actions.calculatePublicDemand();
            updateButtons();
        }, 200);

        // Sauvegarde (5s)
        saveLoopId = setInterval(saveGame, 5000);
    }

    function stopLoops() {
        clearInterval(mainLoopId);
        clearInterval(fastLoopId);
        clearInterval(saveLoopId);
    }

    startLoops();

    // Pause quand l'onglet est caché, reprend quand visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            saveGame();
            stopLoops();
        } else {
            startLoops();
        }
    });

});
