# Albion Client Vue

Client web Vue.js pour consulter les prix des ressources d'Albion Online en temps réel.

## Description

Ce client web permet de visualiser les informations et prix des objets du jeu Albion Online via une interface.

### Fonctionnalités principales

- **Interface responsive** : Navigation optimisée pour desktop et mobile
- **Visualisation des prix** : Affichage des prix par ville avec indicateurs visuels
- **Catégorisation des ressources** : Organisation par type de matériaux (minerais, bois, tissus, etc.)
- **Comparaison des prix** : Statistiques globales et variance par rapport aux prix moyens
- **Indicateurs de fraîcheur** : Information sur l'ancienneté des données de prix

## Architecture

Le projet utilise Vue 3 avec une architecture composant moderne :

- **Components** : Composants Vue pour chaque type de ressource
- **Services** : Couche de communication avec l'API REST
- **Router** : Navigation entre les différentes catégories
- **Styling** : TailwindCSS pour l'interface utilisateur

## Prérequis

- Node.js
- NPM ou Yarn
- API Albion fonctionnelle (voir projet albionAPI)

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd albion-client-vue
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de l'environnement

Créer un fichier `.env` à la racine du projet :

```env
VITE_API_URL=http://localhost:3000/
```

### 4. Lancement de l'application

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Utilisation

### Pages disponibles

#### Ressources brutes
- `/ore` - Minerais
- `/wood` - Bois
- `/cotton` - Coton
- `/hide` - Peaux
- `/stone` - Pierre

#### Ressources raffinées
- `/metalBar` - Barres de métal
- `/planks` - Planches
- `/cloth` - Tissu
- `/leather` - Cuir
- `/stoneblock` - Blocs de pierre

### Interface utilisateur

**Navigation :**
- Barre de navigation avec accès rapide aux catégories
- Organisation en colonnes par type de ressource

**Affichage des prix :**
- Cartes individuelles par ville
- Prix minimum, moyen et maximum
- Indicateurs de variance et de fraîcheur des données
- Images des objets depuis l'API Albion Online

## Structure du projet

```
src/
├── components/
│   ├── ItemComponent.vue          # Composant d'affichage d'un objet
│   ├── NavbarComponent.vue        # Barre de navigation
│   ├── OreComponent.vue           # Page des minerais
│   ├── WoodComponent.vue          # Page du bois
│   ├── CottonComponent.vue        # Page du coton
│   ├── ClothComponent.vue         # Page des tissus
│   ├── HideComponent.vue          # Page des peaux
│   ├── LeatherComponent.vue       # Page du cuir
│   ├── MetalBarComponent.vue      # Page des barres de métal
│   ├── PlankComponent.vue         # Page des planches
│   ├── StoneComponent.vue         # Page de la pierre
│   └── StoneBlockComponent.vue    # Page des blocs de pierre
├── services/
│   ├── api.js                     # Configuration Axios
│   └── itemService.js             # Service de récupération des objets
├── router/
│   └── index.js                   # Configuration des routes
├── assets/
│   ├── main.css                   # Styles globaux et TailwindCSS
│   └── base.css                   # Variables CSS de base
├── App.vue                        # Composant principal
└── main.js                        # Point d'entrée de l'application
```

## Technologies utilisées

- **Vue.js 3** : Framework JavaScript
- **Vite** : Outil de build et serveur de développement
- **Vue Router** : Routage côté client
- **Axios** : Client HTTP pour les appels API
- **TailwindCSS** : Framework CSS utilitaire

## Développement

### Commandes disponibles

```bash
# Développement avec rechargement automatique
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview
```

### Structure des données

Le client attend des données au format suivant depuis l'API :

```json
{
  "data": {
    "_id": "string",
    "UniqueName": "string",
    "LocalizedNames": {
      "FR-FR": "string",
      "EN-US": "string"
    },
    "prices": [
      {
        "city": "string",
        "quality": 1,
        "sell_price_min": 334,
        "sell_price_min_date": "2025-07-25T07:20:00"
      }
    ]
  }
}
```

## Déploiement

### Build de production

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`.

### Variables d'environnement

- `VITE_API_URL` : URL de base de l'API Albion (obligatoire)

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request