/**
 * UI.JS
 * Ce fichier gère uniquement l'affichage (le DOM).
 * Il ne fait aucun calcul mathématique, il se contente d'afficher les valeurs du State.
 */

import { state } from './state.js';

// --- Fonctions Utilitaires ---

// Helper pour modifier le texte d'un élément sans faire planter le script si l'ID n'existe pas
const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
};

// --- Gestion des Messages (Le Terminal en haut) ---

export function showTerminalMessage(text, duration = 5000) {
    const el = document.getElementById('terminalMessage');
    if (!el) return;

    el.textContent = text;
    el.classList.add('visible');
    
    // On annule le timer précédent s'il y en a un (pour éviter que le message disparaisse trop vite)
    clearTimeout(el._hideTimeout);
    
    // On crée un nouveau timer pour cacher le message
    el._hideTimeout = setTimeout(() => {
        el.classList.remove('visible');
    }, duration);
}

// --- Gestion de la visibilité des sections (Déblocage) ---

export function unlockITResources(loading = false) {
    const divIT = document.getElementById('itResourcesDiv');
    const divProjects = document.getElementById('projectsDiv');

    // Sécurité : Si déjà débloqué et affiché, on arrête là pour économiser des ressources
    if (state.itResourcesUnlocked && divIT.style.display !== 'none' && !loading) return;

    // Si c'est la première fois ou si c'est caché
    if (!state.itResourcesUnlocked || divIT.style.display === 'none') {
        divIT.style.display = 'flex';
        state.itResourcesUnlocked = true;

        // On affiche aussi la colonne Projets (même vide) pour garder la mise en page
        if (divProjects) divProjects.style.display = 'flex';

        // Petit message sympa pour le joueur (sauf si on charge une sauvegarde)
        if (!loading) {
            showTerminalMessage("IT Resources unlocked! (Initial Hardware: 1 CPU, 1 RAM)");
        }
        
        // On force une mise à jour immédiate pour éviter de voir des "0" partout
        updateAllDisplays();
    }
}

export function hideITResources() {
    // Fonction utilisée lors du RESET du jeu
    const divIT = document.getElementById('itResourcesDiv');
    const divProjects = document.getElementById('projectsDiv');
    
    if(divIT) divIT.style.display = 'none';
    if(divProjects) divProjects.style.display = 'none';
}

// --- Mise à jour de l'Interface (Boucle principale) ---

export function updateAllDisplays() {
    // 1. Économie
    setText('caps', state.caps);
    setText('unsoldClips', state.unsold);
    setText('funds', state.funds.toFixed(2));
    setText('avgRev', state.revenuePerSecond.toFixed(2));
    
    // 2. Business & Marketing
    setText('priceAutoCapser', state.priceAutoCapser.toFixed(2));
    setText('marketingLvl', state.marketingLvl);
    setText('adCost', state.adCost.toFixed(2));

    // 3. IT Resources
    setText('trust', state.trust);
    setText('nextTrust', state.nextTrustAt.toLocaleString()); // 'toLocaleString' met les espaces (ex: 1 000)
    setText('ops', state.ops);
    setText('cpuCount', state.cpuCount);
    setText('ramCount', state.ramCount);
    setText('opsMax', state.opsMax);

    // Note : La demande est gérée par updateDemandDisplay() appelée dans actions.js
    
    // 4. État des boutons (Grisés ou non)
    updateButtons();
}

export function updateButtons() {
    // Vérifie si on a assez d'argent pour acheter les upgrades
    
    const btnAuto = document.getElementById('BuyAutoCapser');
    if(btnAuto) {
        btnAuto.disabled = state.funds < state.priceAutoCapser;
        btnAuto.textContent = `Buy AutoCapser ($${state.priceAutoCapser.toFixed(2)})`;
    }

    const btnMark = document.getElementById('btnExpandMarketing');
    if(btnMark) btnMark.disabled = state.funds < state.adCost;

    const btnCpu = document.getElementById('btnBuyCPU');
    if(btnCpu) btnCpu.disabled = state.trust < 1;

    const btnRam = document.getElementById('btnBuyRAM');
    if(btnRam) btnRam.disabled = state.trust < 1;
}

// Mises à jour spécifiques (pour performance)
export function updateDemandDisplay(value) {
    setText('demand', value.toFixed(0));
}

export function updateMarginDisplay(value) {
    setText('margin', value.toFixed(2));
}