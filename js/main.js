/**
 * MAIN.JS
 * Point d'entrée de l'application.
 * 1. Charge les sauvegardes.
 * 2. Attache les événements (Clics).
 * 3. Lance les boucles temporelles (Timers).
 */

import { loadGame, saveGame, resetGame } from './storage.js';
import * as Actions from './actions.js';
import { updateButtons } from './ui.js';

// Attendre que le HTML soit totalement chargé
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CHARGEMENT ---
    loadGame();

    // --- 2. ÉVÉNEMENTS (CLICS) ---
    
    // Système
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    
    // Production
    document.getElementById('MakeCaps').addEventListener('click', () => Actions.makeCaps(1));
    
    // Business
    document.getElementById('btnLowerPrice').addEventListener('click', Actions.lowerPrice);
    document.getElementById('btnRaisePrice').addEventListener('click', Actions.raisePrice);
    document.getElementById('BuyAutoCapser').addEventListener('click', Actions.buyAutoCapser);
    document.getElementById('btnExpandMarketing').addEventListener('click', Actions.buyAds);

    // IT & Projets
    document.getElementById('btnBuyCPU').addEventListener('click', Actions.buyCPU);
    document.getElementById('btnBuyRAM').addEventListener('click', Actions.buyRAM);
    document.getElementById('btnImproveAuto').addEventListener('click', Actions.buyImprovedAutoClippers);


    // --- 3. BOUCLES DE JEU (LOOPS) ---
    
    // Boucle A (1 seconde) : Production et Vente
    setInterval(() => {
        Actions.autoGenerateCaps();
        Actions.autoSell();
    }, 1000);

    // Boucle B (1 seconde) : Informatique et Projets
    setInterval(() => {
        Actions.processOps();     // Génération Ops
        Actions.checkProjects();  // Vérification conditions déblocage
    }, 1000);

    // Boucle C (Rapide - 200ms) : Interface et Réactivité
    // On sépare ça pour que l'interface semble fluide quand on change les prix
    setInterval(() => {
        Actions.calculatePublicDemand();
        updateButtons();
    }, 200);

    // Boucle D (5 secondes) : Sauvegarde automatique
    setInterval(saveGame, 5000);

});