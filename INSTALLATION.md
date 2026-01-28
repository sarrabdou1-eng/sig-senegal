# Guide d'Installation et Déploiement - SIG Sénégal

## 📋 Prérequis

- Serveur web (Apache, Nginx, IIS, etc.)
- Navigateur web moderne (Chrome, Firefox, Edge, Safari)
- (Optionnel) QGIS pour générer les données GeoJSON

## 🚀 Installation

### 1. Préparation du Serveur

#### Avec Apache (XAMPP)
```bash
# Copier les fichiers dans le répertoire webroot
cp -r sig-senegal /xampp/htdocs/

# Ou dans le cas de Tomcat
cp -r sig-senegal /xampp/tomcat/webapps/
```

#### Avec IIS
1. Ouvrir Internet Information Services Manager
2. Ajouter un site web
3. Pointer vers le répertoire sig-senegal
4. Activer les répertoires virtuels si nécessaire

### 2. Vérification des Fichiers

Vérifier que la structure des fichiers est correcte :

```
sig-senegal/
├── index.html
├── README.md
├── INSTALLATION.md
├── css/
│   ├── app.css (NOUVEAU)
│   └── [autres CSS]
├── js/
│   ├── app.js (NOUVEAU)
│   ├── config.js (NOUVEAU)
│   ├── utils.js (NOUVEAU)
│   └── [autres JS]
├── data/
│   └── [fichiers GeoJSON]
└── [autres ressources]
```

### 3. Configuration Initiale

#### a) Paramètres de la Carte
Éditer `js/config.js` :

```javascript
map: {
    minZoom: 1,
    maxZoom: 20,
    defaultZoom: 8,
    bounds: [[14.455587820623908,-15.038297818826887],[15.590279642926522,-13.401600485252754]],
    center: [14.5, -14.2]
}
```

#### b) Ajouter des Basemaps
Dans `js/config.js`, ajouter à l'array `basemaps` :

```javascript
{
    id: 'custom',
    name: 'Nouveau Fond',
    icon: '🗺️',
    url: 'https://tile.server.com/{z}/{x}/{y}.png',
    attribution: '© Attribution',
    maxZoom: 19
}
```

#### c) Ajouter des Couches
Dans `js/config.js`, ajouter à l'array `layers` :

```javascript
{
    id: 'couche_custom',
    name: 'Ma Couche',
    dataVar: 'json_couche_custom',
    zIndex: 406,
    fillColor: 'rgba(255,0,0,1.0)',
    strokeColor: 'rgba(0,0,0,1.0)',
    visible: true
}
```

Puis ajouter le script GeoJSON dans `index.html` :
```html
<script src="data/couche_custom.js"></script>
```

## 🔧 Configuration Avancée

### Intégration de Données QGIS

1. **Exporter depuis QGIS2WEB**
   - Ouvrir QGIS
   - Installer l'extension QGIS2WEB
   - Exporter en Web Map
   - Copier les fichiers GeoJSON

2. **Ajouter les données**
   - Placer les fichiers .js dans le dossier `data/`
   - Ajouter la référence dans `index.html`
   - Mettre à jour `js/config.js`

### Personnalisation des Styles

Éditer `css/app.css` pour personnaliser :

- Couleurs : Remplacer `#667eea` et `#764ba2`
- Polices : Modifier `font-family`
- Tailles : Adapter les `width`, `height`, `padding`
- Animations : Modifier les `transition` et `animation`

### Intégration d'API Personnalisées

Modifier `js/app.js` pour intégrer :

- Géocodage personnalisé
- Analyse spatiale
- Requêtes serveur

## 🧪 Tests

### 1. Test Local

```bash
# Avec Python 3
python -m http.server 8000

# Ou avec Node.js
npx http-server

# Accéder à http://localhost:8000/sig-senegal/
```

### 2. Test Navigateur

Vérifier dans la console (F12) :
- Aucune erreur JavaScript
- Toutes les ressources chargées
- La carte s'affiche correctement
- Les panneaux répondent aux clics

### 3. Checklist

- [ ] Carte affichée avec bounds corrects
- [ ] Toutes les couches visibles
- [ ] Basemaps commutables
- [ ] Panneaux latéraux fonctionnels
- [ ] Coordinates dynamiques
- [ ] Échelle dynamique
- [ ] Navigation responsive
- [ ] Modaux s'ouvrent/ferment
- [ ] Pas d'erreurs console

## 🚨 Dépannage

### La carte est blanche

**Solutions :**
1. Vérifier la console pour les erreurs
2. Vérifier que Leaflet.js est chargé
3. Vérifier que les données GeoJSON sont valides
4. Vérifier les permissions de fichiers

### Les couches n'apparaissent pas

**Solutions :**
1. Vérifier que les fichiers GeoJSON existent
2. Vérifier la syntaxe JSON (utiliser jsonlint.com)
3. Vérifier que la variable `json_*` est correctement nommée
4. Vérifier les coordonnées dans les bounds

### Les styles ne s'appliquent pas

**Solutions :**
1. Vider le cache : Ctrl+Shift+Del
2. Forcer le rechargement : Ctrl+F5
3. Vérifier que app.css est dans le bon répertoire
4. Vérifier les chemins d'accès aux ressources

### Performance lente

**Solutions :**
1. Réduire la complexité des GeoJSON
2. Utiliser des tuiles en place de polygones complexes
3. Implémenter la pagination des données
4. Optimiser les images

## 📊 Monitoring et Logs

### Logs Navigateur

Ouvrir DevTools (F12) :
- **Console** : Messages et erreurs
- **Network** : Téléchargement des ressources
- **Performance** : Temps de chargement

### Logs Serveur

Vérifier les logs du serveur :
- Apache : `/var/log/apache2/error.log`
- Nginx : `/var/log/nginx/error.log`
- Tomcat : `/logs/catalina.out`

## 📦 Déploiement en Production

### 1. Optimisation

```bash
# Minifier le CSS
csso -c --output css/app.min.css css/app.css

# Minifier le JavaScript
uglifyjs js/app.js -c -m -o js/app.min.js
```

Mettre à jour les références dans `index.html` :
```html
<link rel="stylesheet" href="css/app.min.css">
<script src="js/app.min.js"></script>
```

### 2. Configuration Serveur

#### Apache - .htaccess
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [QSA,L]
</IfModule>
```

#### Nginx
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 3. Sécurité

- [ ] Ajouter HTTPS
- [ ] Configurer CORS si nécessaire
- [ ] Valider les entrées utilisateur
- [ ] Implémenter l'authentification
- [ ] Chiffrer les données sensibles

### 4. Sauvegarde

```bash
# Sauvegarder toute l'application
tar -czf sig-senegal-backup-2026-01-21.tar.gz sig-senegal/

# Sauvegarder les données
rsync -av sig-senegal/data/ /backup/sig-senegal-data/
```

## 🔄 Mise à Jour

### Procédure de Mise à Jour

1. **Sauvegarder** la version actuelle
2. **Tester** les modifications en local
3. **Remplacer** les fichiers
4. **Vérifier** le fonctionnement
5. **Notifier** les utilisateurs

### Versions Supportées

- Node.js : 12.0.0+
- Chrome : 90+
- Firefox : 88+
- Safari : 14+
- Edge : 90+

## 📞 Support

Pour les problèmes ou questions :
1. Vérifier la documentation
2. Consulter les logs
3. Tester avec les données d'exemple
4. Contacter l'administrateur système

---

**Auteur** : SIG Sénégal
**Version** : 1.0.0
**Date** : Janvier 2026
