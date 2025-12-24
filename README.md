# 🏭 Universal Caps

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

**Universal Caps** est un jeu incrémental (clicker) de gestion stratégique qui fonctionne directement dans le navigateur. Commencez par fabriquer des capsules manuellement, gérez l'offre et la demande, automatisez votre production et débloquez des ressources informatiques avancées pour étendre votre empire.

---

## 📋 Fonctionnalités

### 📈 Économie & Marché
* **Production :** Fabriquez des capsules manuellement ou via des *AutoCapsers*.
* **Gestion des Ventes :** Ajustez le prix de vente pour influencer la demande publique (élasticité prix/demande).
* **Marketing :** Investissez dans des campagnes publicitaires pour augmenter la demande globale.
* **Gestion des Stocks :** Équilibrez votre inventaire invendu et vos liquidités.

### 💻 Système IT & Recherche
* **Ressources Informatiques :** Une fois un certain seuil atteint, débloquez le panneau IT.
* **Confiance (Trust) :** Accumulez de la confiance pour acquérir du nouveau matériel.
* **Processeurs & Mémoire :** Achetez des CPU et de la RAM pour générer des **Ops** (Opérations).
* **Projets :** Utilisez vos Ops pour débloquer des améliorations technologiques (ex: *Improved AutoCapsers*).

### 💾 Système
* **Sauvegarde Automatique :** La progression est sauvegardée localement (`localStorage`) toutes les 5 secondes.
* **Architecture Modulaire :** Code organisé proprement en modules ES6 pour une maintenance facile.

---

## 🚀 Installation et Lancement

Ce projet est une application web statique (HTML/CSS/JS). Aucun compilateur ni backend n'est nécessaire.

### Prérequis
* Un navigateur web moderne (Chrome, Firefox, Edge, Safari).
* (Optionnel) Une extension type "Live Server" pour le développement local.

### Instructions

1.  **Cloner le dépôt :**
    ```bash
    git clone [https://github.com/votre-username/universal_caps.git](https://github.com/votre-username/universal_caps.git)
    cd universal_caps
    ```

2.  **Lancer le jeu :**
    * Ouvrez simplement le fichier `index.html` dans votre navigateur.
    * *Note : En raison de la politique de sécurité des modules ES6 (CORS), certains navigateurs peuvent bloquer le chargement local direct. Il est recommandé d'utiliser un serveur local.*

    **Avec Python (si installé) :**
    ```bash
    python -m http.server
    # Ouvrez ensuite http://localhost:8000
    ```

    **Avec VS Code :**
    clic-droit sur `index.html` -> "Open with Live Server".

---

## 📂 Structure du Projet

Le projet suit une architecture modulaire claire :

```text
universal_caps/
├── index.html        # Point d'entrée et structure DOM
├── style.css         # Styles (Interface type Terminal/Dashboard)
├── .gitignore        # Fichiers ignorés par Git
└── js/               # Logique du jeu
    ├── main.js       # Initialisation et boucles de jeu (Game Loops)
    ├── state.js      # Single Source of Truth (État global)
    ├── actions.js    # Logique métier (Achat, Production, Calculs)
    ├── ui.js         # Manipulation du DOM et Affichage
    └── storage.js    # Gestion de la sauvegarde/chargement (LocalStorage)