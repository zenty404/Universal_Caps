import { state } from './state.js';
import { updateAllDisplays, unlockITResources, showTerminalMessage, hideITResources } from './ui.js';

export function saveGame() {
    localStorage.setItem('caps', state.caps);
    localStorage.setItem('unsold', state.unsold);
    localStorage.setItem('funds', state.funds);
    localStorage.setItem('autoCapsers', state.autoCapsers);
    localStorage.setItem('priceAutoCapser', state.priceAutoCapser);
    localStorage.setItem('marketingLvl', state.marketingLvl);
    localStorage.setItem('adCost', state.adCost);
    localStorage.setItem('hasImprovedAutoClippers', state.hasImprovedAutoClippers);
    localStorage.setItem('autoCapserPerformance', state.autoCapserPerformance);
    
    // IT
    localStorage.setItem('trust', state.trust);
    localStorage.setItem('nextTrustAt', state.nextTrustAt);
    localStorage.setItem('ops', state.ops);
    localStorage.setItem('cpuCount', state.cpuCount);
    localStorage.setItem('ramCount', state.ramCount);
    localStorage.setItem('itResourcesUnlocked', state.itResourcesUnlocked);
    
    // Milestones
    localStorage.setItem('reached', JSON.stringify([...state.reached])); // Set -> Array

    // Temps
    const elapsed = Date.now() - state.sessionStart;
    const prevElapsed = parseInt(localStorage.getItem('elapsed')) || 0;
    localStorage.setItem('elapsed', prevElapsed + elapsed);
    
    // Reset session timer pour ne pas compter en double
    state.sessionStart = Date.now();
}

export function loadGame() {
    state.caps = parseInt(localStorage.getItem('caps')) || 0;
    state.unsold = parseInt(localStorage.getItem('unsold')) || 0;
    state.funds = parseFloat(localStorage.getItem('funds')) || 0;
    state.autoCapsers = parseInt(localStorage.getItem('autoCapsers')) || 0;
    state.priceAutoCapser = parseFloat(localStorage.getItem('priceAutoCapser')) || 15;
    state.marketingLvl = parseInt(localStorage.getItem('marketingLvl')) || 1;
    state.adCost = parseFloat(localStorage.getItem('adCost')) || 100;
    
    state.trust = parseInt(localStorage.getItem('trust')) || 0;
    state.nextTrustAt = parseInt(localStorage.getItem('nextTrustAt')) || 2000;
    state.ops = parseInt(localStorage.getItem('ops')) || 0;
    state.cpuCount = parseInt(localStorage.getItem('cpuCount')) || 1;
    state.ramCount = parseInt(localStorage.getItem('ramCount')) || 1;
    state.itResourcesUnlocked = localStorage.getItem('itResourcesUnlocked') === 'true';

    state.opsMax = state.ramCount * 1000;

    // Milestones
    const reachedArray = JSON.parse(localStorage.getItem('reached'));
    state.reached.clear();
    if (reachedArray) {
        reachedArray.forEach(m => state.reached.add(m));
    }
    // Check milestones already met based on caps
    state.milestones.forEach(m => {
        if (state.caps >= m) state.reached.add(m);
    });

    updateAllDisplays();
    if (state.itResourcesUnlocked) {
        unlockITResources(true);
    }
    
    if(state.caps > 0) {
        showTerminalMessage("Last save loaded.");
    }

        state.hasImprovedAutoClippers = localStorage.getItem('hasImprovedAutoClippers') === 'true';
    // Si pas de sauvegarde, on revient à 1
    state.autoCapserPerformance = parseFloat(localStorage.getItem('autoCapserPerformance')) || 1;

    // Si on a déjà l'amélioration au chargement, on s'assure que le bouton reste caché
    if (state.hasImprovedAutoClippers) {
        const btn = document.getElementById('btnImproveAuto');
        if(btn) btn.style.display = 'none';
    }
}

export function resetGame() {
    // Reset State
    state.caps = 0;
    state.unsold = 0;
    state.funds = 0;
    state.autoCapsers = 0;
    state.priceAutoCapser = 15;
    state.marketingLvl = 1;
    state.adCost = 100;

    state.trust = 0;
    state.nextTrustAt = 1000;
    state.ops = 0;
    state.cpuCount = 1;
    state.ramCount = 1;
    state.opsMax = 1000;
    state.itResourcesUnlocked = false;

    state.reached.clear();
    localStorage.clear();

    hideITResources();
    updateAllDisplays();
    // On met à jour la demande manuellement à 0 pour l'affichage immédiat
    document.getElementById('demand').textContent = "0";

    showTerminalMessage("Game reset! IT Systems Rebooted.", 5000);
}