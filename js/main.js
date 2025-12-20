import { loadGame, saveGame, resetGame } from './storage.js';
import * as Actions from './actions.js';
import { updateButtons } from './ui.js';

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Charger la partie
    loadGame();

    // 2. Attacher les événements (Event Listeners)
    // C'est ici qu'on remplace les "onclick" du HTML
    
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    
    document.getElementById('MakeCaps').addEventListener('click', () => Actions.makeCaps(1));
    
    document.getElementById('btnLowerPrice').addEventListener('click', Actions.lowerPrice);
    document.getElementById('btnRaisePrice').addEventListener('click', Actions.raisePrice);
    
    document.getElementById('BuyAutoCapser').addEventListener('click', Actions.buyAutoCapser);
    document.getElementById('btnExpandMarketing').addEventListener('click', Actions.buyAds);

    document.getElementById('btnImproveAuto').addEventListener('click', Actions.buyImprovedAutoClippers);
    
    document.getElementById('btnBuyCPU').addEventListener('click', Actions.buyCPU);
    document.getElementById('btnBuyRAM').addEventListener('click', Actions.buyRAM);


    // 3. Lancer les boucles de jeu (Game Loops)
    
    // Auto Generation (1 sec)
    setInterval(Actions.autoGenerateCaps, 1000);
    
    // Auto Sell (1 sec)
    setInterval(Actions.autoSell, 1000);

    // Generation Ops (1 sec) - MODIFIÉ ICI
    setInterval(() => {
        Actions.processOps();     // On génère les points d'Ops
        Actions.checkProjects();  // On vérifie si on débloque le projet
    }, 1000);

    // Mise à jour Demande & Boutons (plus rapide pour réactivité : 200ms)
    setInterval(() => {
        Actions.calculatePublicDemand();
        updateButtons();
    }, 200);

    // Sauvegarde auto (5 sec)
    setInterval(saveGame, 5000);

});