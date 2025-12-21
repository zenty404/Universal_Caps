/**
 * STORAGE.JS
 * Gère le LocalStorage du navigateur.
 * Permet de sauvegarder la progression et de la recharger quand on rafraîchit la page.
 */

import { state } from './state.js';
import { updateAllDisplays, unlockITResources, showTerminalMessage, hideITResources } from './ui.js';

export function saveGame() {
    // On convertit toutes les valeurs importantes en chaînes de caractères
    localStorage.setItem('caps', state.caps);
    localStorage.setItem('unsold', state.unsold);
    localStorage.setItem('funds', state.funds);
    localStorage.setItem('autoCapsers', state.autoCapsers);
    localStorage.setItem('priceAutoCapser', state.priceAutoCapser);
    localStorage.setItem('marketingLvl', state.marketingLvl);
    localStorage.setItem('adCost', state.adCost);
    
    // Upgrades
    localStorage.setItem('hasImprovedAutoClippers', state.hasImprovedAutoClippers);
    localStorage.setItem('autoCapserPerformance', state.autoCapserPerformance);
    
    // IT Resources
    localStorage.setItem('trust', state.trust);
    localStorage.setItem('nextTrustAt', state.nextTrustAt);
    localStorage.setItem('ops', state.ops);
    localStorage.setItem('cpuCount', state.cpuCount);
    localStorage.setItem('ramCount', state.ramCount);
    localStorage.setItem('itResourcesUnlocked', state.itResourcesUnlocked);
    
    // Pour les objets complexes comme les Sets ou les tableaux, on utilise JSON.stringify
    localStorage.setItem('reached', JSON.stringify([...state.reached])); 

    // Gestion du temps de jeu
    const elapsed = Date.now() - state.sessionStart;
    const prevElapsed = parseInt(localStorage.getItem('elapsed')) || 0;
    localStorage.setItem('elapsed', prevElapsed + elapsed);
    
    // On remet le timer à zéro pour ne pas compter le temps deux fois
    state.sessionStart = Date.now();
}

export function loadGame() {
    // On récupère les valeurs. Le "|| 0" sert de valeur par défaut si la sauvegarde est vide.
    state.caps = parseInt(localStorage.getItem('caps')) || 0;
    state.unsold = parseInt(localStorage.getItem('unsold')) || 0;
    state.funds = parseFloat(localStorage.getItem('funds')) || 0;
    
    state.autoCapsers = parseInt(localStorage.getItem('autoCapsers')) || 0;
    state.priceAutoCapser = parseFloat(localStorage.getItem('priceAutoCapser')) || 15;
    
    state.marketingLvl = parseInt(localStorage.getItem('marketingLvl')) || 1;
    state.adCost = parseFloat(localStorage.getItem('adCost')) || 100;
    
    // IT Load
    state.trust = parseInt(localStorage.getItem('trust')) || 0;
    state.nextTrustAt = parseInt(localStorage.getItem('nextTrustAt')) || 1000;
    state.ops = parseInt(localStorage.getItem('ops')) || 0;
    state.cpuCount = parseInt(localStorage.getItem('cpuCount')) || 1;
    state.ramCount = parseInt(localStorage.getItem('ramCount')) || 1;
    state.itResourcesUnlocked = localStorage.getItem('itResourcesUnlocked') === 'true';

    // Recalcul des valeurs dérivées
    state.opsMax = state.ramCount * 1000;

    // Upgrades Load
    state.hasImprovedAutoClippers = localStorage.getItem('hasImprovedAutoClippers') === 'true';
    state.autoCapserPerformance = parseFloat(localStorage.getItem('autoCapserPerformance')) || 1;

    // Gestion des Milestones (Paliers)
    const reachedArray = JSON.parse(localStorage.getItem('reached'));
    state.reached.clear();
    
    // Restauration des paliers déjà atteints
    if (reachedArray) {
        reachedArray.forEach(m => state.reached.add(m));
    }
    // Double sécurité : on vérifie les paliers par rapport aux caps actuelles
    state.milestones.forEach(m => {
        if (state.caps >= m) state.reached.add(m);
    });

    // --- APPLICATION VISUELLE ---
    
    updateAllDisplays();
    
    // Restauration de l'affichage IT si débloqué
    if (state.itResourcesUnlocked) {
        unlockITResources(true); // 'true' signifie mode chargement (pas de message pop-up)
    }
    
    // Gestion de l'affichage du bouton Projet
    if (state.hasImprovedAutoClippers) {
        const btn = document.getElementById('btnImproveAuto');
        if(btn) btn.style.display = 'none'; // Caché car déjà acheté
    }
    
    if(state.caps > 0) {
        showTerminalMessage("Last save loaded.");
    }
}

export function resetGame() {
    // 1. Reset des variables d'état (on remet tout à zéro)
    state.caps = 0;
    state.unsold = 0;
    state.funds = 0;
    
    state.autoCapsers = 0;
    state.priceAutoCapser = 15;
    state.autoCapserPerformance = 1;
    state.hasImprovedAutoClippers = false;
    
    state.marketingLvl = 1;
    state.adCost = 100;

    state.trust = 0;
    state.nextTrustAt = 1000;
    state.ops = 0;
    state.cpuCount = 1;
    state.ramCount = 1;
    state.opsMax = 1000;
    state.itResourcesUnlocked = false;

    // 2. Nettoyage du stockage navigateur
    state.reached.clear();
    localStorage.clear();

    // 3. Reset visuel
    hideITResources();
    updateAllDisplays();
    
    // Reset spécifique de l'affichage
    document.getElementById('demand').textContent = "0";
    
    // Reset du bouton projet
    const btnProject = document.getElementById('btnImproveAuto');
    if(btnProject) {
        btnProject.style.display = 'none';
        btnProject.disabled = false;
    }

    showTerminalMessage("Game reset! IT Systems Rebooted.", 5000);
}