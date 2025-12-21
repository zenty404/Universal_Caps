/**
 * STATE.JS
 * Ce fichier contient l'état unique de vérité de ton application (Single Source of Truth).
 * Toutes les données qui doivent être sauvegardées ou modifiées sont ici.
 */

export const state = {
    // --- Économie & Ressources de base ---
    caps: 0,
    unsold: 0,              // Stock invendu
    funds: 0,               // Argent disponible
    revenuePerSecond: 0,    // Calculé pour l'affichage uniquement

    // --- Production Automatisée (AutoCapsers) ---
    autoCapsers: 0,
    priceAutoCapser: 15,
    autoCapserPerformance: 1,       // 1 = 100% (vitesse normale)
    hasImprovedAutoClippers: false, // Est-ce qu'on a acheté l'upgrade ?

    // --- Marketing & Demande ---
    marketingLvl: 1,
    adCost: 100,

    // --- Ressources Informatiques (IT) ---
    itResourcesUnlocked: false, // Est-ce que la section IT est visible ?
    trust: 0,                   // Confiance accumulée
    nextTrustAt: 1000,          // Prochain palier pour gagner de la confiance
    ops: 0,                     // Opérations (calcul)
    opsMax: 1000,               // Capacité max (dépend de la RAM)
    cpuCount: 1,                // Vitesse de génération des Ops
    ramCount: 1,                // Stockage max des Ops

    // --- Système & Progression ---
    sessionStart: Date.now(),   // Pour calculer le temps de jeu
    
    // Les 'Set' sont des listes qui ne contiennent que des valeurs uniques.
    // Idéal pour stocker des paliers qu'on ne veut atteindre qu'une seule fois.
    reached: new Set(), 
    milestones: [100, 1000, 10000, 100000, 1000000, 10000000, 100000000]
};