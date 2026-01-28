/**
 * Exemples d'Utilisation Avancée - SIG Sénégal
 * Snippets de code pour étendre les fonctionnalités
 */

// ==================== Exemple 1: Ajouter une Couche Personnalisée ====================

/**
 * Ajouter une couche GeoJSON personnalisée dynamiquement
 */
function addCustomLayer(geojsonData, layerName, color) {
    const layer = L.geoJson(geojsonData, {
        style: {
            color: color,
            weight: 2,
            opacity: 0.7,
            fillOpacity: 0.4
        },
        onEachFeature: (feature, layer) => {
            const popupContent = SIGUtils.formatProperties(feature.properties);
            layer.bindPopup(popupContent);
        }
    });

    layer.addTo(map);

    // Ajouter à la liste des couches
    const layerPanel = document.getElementById('layers-panel');
    const layerItem = document.createElement('div');
    layerItem.className = 'layer-item';
    layerItem.innerHTML = `
        <label>
            <input type="checkbox" class="layer-toggle" checked>
            <span>${layerName}</span>
        </label>
    `;
    layerPanel.appendChild(layerItem);

    layerItem.querySelector('.layer-toggle').addEventListener('change', (e) => {
        if (e.target.checked) {
            map.addLayer(layer);
        } else {
            map.removeLayer(layer);
        }
    });

    SIGUtils.showNotification(`Couche "${layerName}" ajoutée avec succès!`, 'success');
}

// Utilisation:
// const customData = { /* votre GeoJSON */ };
// addCustomLayer(customData, 'Ma Couche', '#FF5733');


// ==================== Exemple 2: Requête Spatiale Avancée ====================

/**
 * Effectuer une requête spatiale avancée
 */
function advancedSpatialQuery(bounds, attributes = {}) {
    let results = [];

    // Filtrer chaque couche
    allLayers.forEach(layerObj => {
        const filtered = SIGUtils.filterFeaturesByBounds(layerObj.data.features || [], bounds);
        
        // Appliquer les filtres d'attributs
        const final = filtered.filter(feature => {
            for (const [key, value] of Object.entries(attributes)) {
                if (feature.properties[key] !== value) {
                    return false;
                }
            }
            return true;
        });

        results = results.concat(final.map(f => ({
            ...f,
            layer: layerObj.name
        })));
    });

    // Afficher les résultats
    showQueryResults(results);
    
    SIGUtils.showNotification(`${results.length} résultats trouvés`, 'info');
    return results;
}

// Utilisation:
// const bounds = map.getBounds();
// const results = advancedSpatialQuery(bounds, { 'Région': 'Dakar' });


// ==================== Exemple 3: Créer une Heatmap ====================

/**
 * Créer une heatmap à partir de points
 */
function createHeatmap(features, intensity = 'NOM') {
    const heatmapData = features.map(feature => {
        const coords = feature.geometry.coordinates;
        const value = parseFloat(feature.properties[intensity]) || 1;
        return [coords[1], coords[0], value];
    });

    if (window.L.heatLayer) {
        const heatmapLayer = L.heatLayer(heatmapData, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            max: 100,
            gradient: {
                0.0: '#0000FF',
                0.25: '#00FF00',
                0.5: '#FFFF00',
                0.75: '#FF8800',
                1.0: '#FF0000'
            }
        });

        heatmapLayer.addTo(map);
        SIGUtils.showNotification('Heatmap créée', 'success');
        return heatmapLayer;
    } else {
        SIGUtils.showNotification('Leaflet.heat requis', 'error');
    }
}

// Utilisation:
// createHeatmap(json_localites_5.features, 'NOM');


// ==================== Exemple 4: Export Personnalisé ====================

/**
 * Export personnalisé avec filtrage
 */
function customExport(format = 'geojson', filtered = false) {
    let dataToExport = [];

    // Rassembler les données
    allLayers.forEach(layerObj => {
        dataToExport = dataToExport.concat(layerObj.data.features || []);
    });

    // Filtrer si nécessaire
    if (filtered) {
        const bounds = map.getBounds();
        dataToExport = SIGUtils.filterFeaturesByBounds(dataToExport, bounds);
    }

    // Exporter selon le format
    if (format === 'geojson') {
        const geojson = { type: 'FeatureCollection', features: dataToExport };
        SIGUtils.exportGeoJSON(geojson, 'export_sig_senegal.geojson');
    } else if (format === 'csv') {
        SIGUtils.exportCSV(dataToExport, 'export_sig_senegal.csv');
    }

    SIGUtils.showNotification(`Export en ${format} réussi`, 'success');
}

// Utilisation:
// customExport('csv', true);  // Export CSV des données visibles


// ==================== Exemple 5: Analyse Statistique ====================

/**
 * Effectuer une analyse statistique sur une couche
 */
function analyzeLayer(layerName) {
    const layerObj = allLayers.find(l => l.name === layerName);
    if (!layerObj) {
        SIGUtils.showNotification('Couche non trouvée', 'error');
        return;
    }

    const stats = SIGUtils.getLayerStatistics(layerObj.data.features || []);
    
    // Afficher les statistiques
    const statHTML = `
        <h3>Statistiques - ${layerName}</h3>
        <p><strong>Nombre d'entités :</strong> ${stats.count}</p>
        <p><strong>Types de géométrie :</strong></p>
        <ul>
            ${Object.entries(stats.types).map(([type, count]) => 
                `<li>${type}: ${count}</li>`
            ).join('')}
        </ul>
        ${stats.boundingBox ? `
            <p><strong>Zone couverte :</strong></p>
            <p>Lat: ${stats.boundingBox[0][0].toFixed(2)} à ${stats.boundingBox[1][0].toFixed(2)}</p>
            <p>Lng: ${stats.boundingBox[0][1].toFixed(2)} à ${stats.boundingBox[1][1].toFixed(2)}</p>
        ` : ''}
    `;

    openModal(`Analyse - ${layerName}`, statHTML);
    return stats;
}

// Utilisation:
// analyzeLayer('Régions');


// ==================== Exemple 6: Clusering Personnalisé ====================

/**
 * Créer un clustering personnalisé
 */
function createCustomCluster(features, options = {}) {
    const defaultOptions = {
        maxClusterRadius: 80,
        disableClusteringAtZoom: 15,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false
    };

    const clusterOptions = { ...defaultOptions, ...options };
    const cluster = new L.MarkerClusterGroup(clusterOptions);

    const layer = L.geoJson(features, {
        pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {
                radius: 5,
                fillColor: '#667eea',
                color: '#764ba2',
                weight: 1,
                opacity: 0.8,
                fillOpacity: 0.7
            });
        }
    });

    cluster.addLayer(layer);
    map.addLayer(cluster);

    SIGUtils.showNotification('Clustering créé', 'success');
    return cluster;
}

// Utilisation:
// createCustomCluster(json_localites_5.features);


// ==================== Exemple 7: Dessiner sur la Carte ====================

/**
 * Permettre au utilisateur de dessiner des formes
 */
function enableDrawing() {
    // Nécessite Leaflet Draw
    if (!L.Draw) {
        SIGUtils.showNotification('Leaflet Draw requis', 'error');
        return;
    }

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
        draw: {
            polygon: true,
            polyline: true,
            rectangle: true,
            circle: true,
            marker: true
        },
        edit: {
            featureGroup: drawnItems
        }
    });

    map.addControl(drawControl);

    map.on('draw:created', function(e) {
        const layer = e.layer;
        drawnItems.addLayer(layer);
        SIGUtils.showNotification('Forme dessinée', 'success');
    });

    map.on('draw:edited', function(e) {
        SIGUtils.showNotification('Forme modifiée', 'info');
    });

    map.on('draw:deleted', function(e) {
        SIGUtils.showNotification('Forme supprimée', 'info');
    });
}

// Utilisation:
// enableDrawing();


// ==================== Exemple 8: Intégration API Externe ====================

/**
 * Intégrer une API externe (exemple: OpenWeather)
 */
function addWeatherData(lat, lng) {
    const apiKey = 'YOUR_API_KEY'; // À remplacer
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const popup = L.popup()
                .setLatLng([lat, lng])
                .setContent(`
                    <strong>${data.name}</strong><br>
                    Température: ${data.main.temp}°C<br>
                    Condition: ${data.weather[0].description}
                `)
                .openOn(map);
            
            SIGUtils.showNotification('Données météo chargées', 'success');
        })
        .catch(err => {
            SIGUtils.showNotification('Erreur chargement météo', 'error');
            console.error(err);
        });
}

// Utilisation:
// addWeatherData(14.6921, -15.5007);  // Dakar


// ==================== Exemple 9: Sauvegarde de Vue ====================

/**
 * Sauvegarder et restaurer l'état de la carte
 */
function saveMapState() {
    const state = {
        center: map.getCenter(),
        zoom: map.getZoom(),
        basemap: currentBasemap,
        visibleLayers: [],
        timestamp: new Date()
    };

    // Identifier les couches visibles
    document.querySelectorAll('.layer-toggle:checked').forEach((checkbox, idx) => {
        state.visibleLayers.push(idx);
    });

    // Sauvegarder dans le local storage
    localStorage.setItem('sig_map_state', JSON.stringify(state));
    SIGUtils.showNotification('État de la carte sauvegardé', 'success');

    // Générer un lien de partage
    const shareUrl = SIGUtils.getShareUrl(state.center.lat, state.center.lng, state.zoom);
    console.log('Share URL:', shareUrl);

    return state;
}

function restoreMapState() {
    const saved = localStorage.getItem('sig_map_state');
    if (!saved) {
        SIGUtils.showNotification('Aucun état sauvegardé', 'info');
        return;
    }

    const state = JSON.parse(saved);
    map.setView(state.center, state.zoom);
    
    // Restaurer les couches visibles
    document.querySelectorAll('.layer-toggle').forEach((checkbox, idx) => {
        checkbox.checked = state.visibleLayers.includes(idx);
        checkbox.dispatchEvent(new Event('change'));
    });

    SIGUtils.showNotification('État de la carte restauré', 'success');
}

// Utilisation:
// saveMapState();
// restoreMapState();


// ==================== Exemple 10: Intégration Base de Données ====================

/**
 * Charger des données depuis une base de données
 */
async function loadFromDatabase(table) {
    try {
        const response = await fetch(`/api/geojson/${table}`);
        const geojson = await response.json();
        
        addCustomLayer(geojson, table, SIGUtils.getRandomColor());
        SIGUtils.showNotification(`Données de ${table} chargées`, 'success');
        
        return geojson;
    } catch (error) {
        SIGUtils.showNotification(`Erreur: ${error.message}`, 'error');
        console.error(error);
    }
}

// Utilisation (avec backend):
// loadFromDatabase('mon_table');


// ==================== Intégration dans l'App ====================

/**
 * Ajouter ces fonctionnalités au menu ou à la navigation
 */
function setupAdvancedFeatures() {
    // Exemple: ajouter un bouton pour les statistiques
    const statsButton = document.createElement('button');
    statsButton.textContent = '📊 Stats';
    statsButton.style.cssText = `
        padding: 10px 15px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin: 10px;
    `;
    statsButton.onclick = () => analyzeLayer('Régions');
    
    // Ajouter au panneau des couches
    // document.getElementById('layers-panel').appendChild(statsButton);
}

// Appeler lors du chargement
// setupAdvancedFeatures();

// ==================== Fin des Exemples ====================

/**
 * Conseils d'Utilisation:
 * 
 * 1. Tester d'abord en console du navigateur (F12)
 * 2. Utiliser SIGUtils pour les fonctions courantes
 * 3. Adapter les styles aux couleurs du APP_CONFIG
 * 4. Implémenter des vérifications d'erreur
 * 5. Documenter le code
 * 6. Tester sur mobiles/tablettes
 * 
 * Pour de l'aide:
 * - Consultez la documentation Leaflet: https://leafletjs.com
 * - Consulter les exemples fournis
 * - Vérifier la console navigateur pour les erreurs
 */
