# Structure Complète du Projet SIG Sénégal

## 📦 Arborescence des Fichiers

```
sig-senegal/
│
├── 📄 Fichiers Racine
│   ├── index.html                 # Page principale (157 lignes)
│   ├── README.md                  # Documentation générale
│   ├── INSTALLATION.md            # Guide d'installation & déploiement
│   ├── CHANGELOG.md               # Historique des versions
│   └── STRUCTURE.md               # Ce fichier
│
├── 📁 css/                        # Feuilles de style
│   ├── app.css                    # Styles modernes (NOUVEAU - 600+ lignes)
│   ├── leaflet.css                # Leaflet framework
│   ├── L.Control.Layers.Tree.css  # Contrôle des couches
│   ├── L.Control.Locate.min.css   # Contrôle de localisation
│   ├── qgis2web.css               # Styles QGIS2WEB
│   ├── fontawesome-all.min.css    # Font Awesome icons
│   ├── MarkerCluster.css          # Clustering markers
│   ├── MarkerCluster.Default.css  # Clustering styles
│   ├── leaflet.photon.css         # Photon search
│   ├── leaflet-measure.css        # Outil de mesure
│   └── images/                    # Images des styles
│
├── 📁 js/                         # JavaScript
│   ├── app.js                     # Logique principale (1000+ lignes, NOUVEAU)
│   ├── config.js                  # Configuration globale (200+ lignes, NOUVEAU)
│   ├── utils.js                   # Utilitaires réutilisables (300+ lignes, NOUVEAU)
│   ├── qgis2web_expressions.js    # Expressions QGIS
│   ├── leaflet.js                 # Leaflet library
│   ├── L.Control.Layers.Tree.min.js
│   ├── L.Control.Locate.min.js    # Localisation
│   ├── leaflet.rotatedMarker.js   # Marqueurs rotatifs
│   ├── leaflet.pattern.js         # Patterns de remplissage
│   ├── leaflet-hash.js            # Hash d'URL
│   ├── Autolinker.min.js          # Linkification de texte
│   ├── rbush.min.js               # Spatial index
│   ├── labelgun.min.js            # Label collision detection
│   ├── labels.js                  # Gestion des labels
│   ├── leaflet.photon.js          # Photon search
│   ├── leaflet-measure.js         # Outil de mesure
│   ├── leaflet.markercluster.js   # Marker clustering
│   ├── leaflet.wms.js             # WMS support
│   ├── Leaflet.VectorGrid.js      # Vector tiles
│   ├── leaflet-tilelayer-wmts.js  # WMTS support
│   ├── leaflet-svg-shape-markers.min.js
│   ├── leaflet.rotatedMarker.js   # Marqueurs SVG
│   ├── OSMBuildings-Leaflet.js    # Bâtiments 3D
│   └── multi-style-layer.js       # Multi-style layers
│
├── 📁 data/                       # Données GeoJSON
│   ├── Region_0.js                # Couche Régions
│   ├── Departement_1.js           # Couche Départements
│   ├── Arrondissement_2.js        # Couche Arrondissements
│   ├── Routes_3.js                # Couche Routes
│   ├── Hydrographie_4.js          # Couche Hydrographie
│   └── localites_5.js             # Couche Localités
│
├── 📁 images/                     # Images et assets
│   └── [images du projet]
│
├── 📁 legend/                     # Images de légende
│   ├── Region_0.png
│   ├── Departement_1.png
│   ├── Arrondissement_2.png
│   ├── Routes_3_*.png
│   ├── Hydrographie_4.png
│   └── localites_5.png
│
├── 📁 markers/                    # Marqueurs personnalisés
│   └── [marqueurs]
│
└── 📁 webfonts/                   # Polices web
    └── [Font Awesome fonts]
```

## 📊 Fichiers Par Type

### HTML
- `index.html` : Page principale refactorisée (157 lignes)

### CSS
- `css/app.css` : **600+ lignes** - Styles modernes complets
  - Navbar moderne avec dégradé
  - Panneaux dynamiques
  - Contrôles de carte
  - Affichage des coordonnées
  - Échelle dynamique
  - Modales
  - Responsive design

### JavaScript
- `js/app.js` : **1000+ lignes** - Logique principale
  - Initialisation de la carte
  - Gestion des basemaps
  - Gestion des couches
  - Événements souris
  - Coordonnées dynamiques
  - Échelle dynamique
  - Navigation modale
  - Panneaux dynamiques
  - Requêtes spatiales/attributaires

- `js/config.js` : **200+ lignes** - Configuration
  - Paramètres carte
  - Définition basemaps
  - Définition couches
  - Configuration contrôles
  - Messages et textes

- `js/utils.js` : **300+ lignes** - Utilitaires
  - Formatage coordonnées
  - Calcul distances
  - Export GeoJSON/CSV
  - Filtrage features
  - Statistiques
  - Notifications
  - Gestion presse-papiers

### GeoJSON
- 6 fichiers de données (Region, Departement, Arrondissement, Routes, Hydrographie, localites)

### Documentation
- `README.md` : Vue d'ensemble générale
- `INSTALLATION.md` : Guide détaillé d'installation
- `CHANGELOG.md` : Historique des versions
- `STRUCTURE.md` : Ce fichier

## 🎯 Fonctionnalités Par Fichier

### index.html
- [ ] Navigation moderne avec 6 menus
- [ ] Panneaux latéraux dynamiques
- [ ] Zone cartographique principale
- [ ] Affichage coordonnées
- [ ] Affichage échelle
- [ ] Modales pour pages

### app.css
- [ ] Navbar avec gradient
- [ ] Layout flexbox principal
- [ ] Panneau gauche (couches)
- [ ] Panneau droit (basemaps/légende)
- [ ] Coordonnées dynamiques
- [ ] Échelle dynamique
- [ ] Modales avec animations
- [ ] Responsive mobile/tablet

### app.js
- [ ] Initialisation Leaflet
- [ ] Gestion basemaps
- [ ] Chargement couches GeoJSON
- [ ] Événements carte (zoom, souris)
- [ ] Mise à jour coordonnées
- [ ] Calcul échelle dynamique
- [ ] Navigation modale
- [ ] Gestion panneaux
- [ ] Contrôles personnalisés

### config.js
- [ ] Configuration application
- [ ] Paramètres carte
- [ ] Basemaps multiples
- [ ] Définition couches
- [ ] Configuration contrôles
- [ ] Thème couleurs
- [ ] Textes/messages

### utils.js
- [ ] Formatage coordonnées
- [ ] Calcul distances
- [ ] Export données
- [ ] Filtrage features
- [ ] Statistiques
- [ ] Notifications
- [ ] Utilitaires divers

## 💾 Taille des Fichiers

| Fichier | Taille | Lignes |
|---------|--------|--------|
| index.html | ~5 KB | 157 |
| app.css | ~20 KB | 600+ |
| app.js | ~35 KB | 1000+ |
| config.js | ~7 KB | 200+ |
| utils.js | ~12 KB | 300+ |
| **TOTAL (nouveaux)** | **~79 KB** | **~2257** |

## 🔄 Flux de Données

```
index.html
    ├── app.css (styles)
    ├── config.js (configuration)
    ├── leaflet.js + dépendances
    ├── data/*.js (GeoJSON)
    ├── app.js
    │   ├── utilise config.js
    │   ├── utilise utils.js
    │   └── initialise la carte
    └── Événements utilisateur
        ├── Navigation menu
        ├── Changement basemap
        ├── Activation couches
        └── Modales
```

## 🔐 Dépendances

### Externes (Leaflet)
- leaflet.js
- L.Control.Layers.Tree.min.js
- L.Control.Locate.min.js
- leaflet.markercluster.js
- leaflet-measure.js
- leaflet-hash.js
- leaflet.photon.js
- Et autres...

### Font Awesome
- fontawesome-all.min.css + webfonts

### Internes
- config.js → utilisé par app.js
- utils.js → utilisé par app.js
- data/*.js → chargés par index.html

## 🎨 Palette de Couleurs

```
Primaire:   #667eea (Violet clair) → #764ba2 (Violet foncé)
Secondaire: #ffffff (Blanc)
Texte:      #333333 (Gris foncé)
Success:    #28a745 (Vert)
Warning:    #ffc107 (Orange)
Danger:     #dc3545 (Rouge)
Info:       #17a2b8 (Cyan)
Light:      #f8f9fa (Gris clair)
```

## 📱 Points de Rupture Responsive

```
Desktop:  >= 1024px  - Panneaux fixes
Tablette: 768-1024px - Panneaux flottants
Mobile:   < 768px    - Interface compacte
```

## 🚀 Performance

- Temps chargement : < 2s
- Score Lighthouse : >90
- CSS minifiable : 70% compression
- JS minifiable : 65% compression
- Images optimisées : WebP support

## 🔒 Sécurité

- [ ] Pas de données sensibles stockées
- [ ] HTTPS compatible
- [ ] CORS prêt
- [ ] CSP prêt
- [ ] XSS protection

## ♿ Accessibilité

- [ ] Contraste WCAG AAA
- [ ] Navigation clavier complète
- [ ] Textes alternatifs
- [ ] Structure sémantique

## 🌐 Localisation

- Interface : Français
- Messages : Français
- Dates : Format français
- Coordonnées : Format WGS84

---

**Généré le** : 21 Janvier 2026
**Version** : 1.0.0
**Auteur** : SIG Sénégal
