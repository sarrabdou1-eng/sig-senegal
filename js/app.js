// ==================== Global Variables ====================
let map;
let basemapLayers = {};
let currentBasemap = 'osm';
let allLayers = [];
let selectedFeatures = [];

// ==================== Initialize Map ====================
function initMap() {
    // Create map
    map = L.map('map', {
        zoomControl: false,
        maxZoom: 20,
        minZoom: 1
    }).fitBounds([[14.455587820623908,-15.038297818826887],[15.590279642926522,-13.401600485252754]]);

    // Add hash for URL tracking
    var hash = new L.Hash(map);

    // Set attribution
    map.attributionControl.setPrefix('<a href="https://github.com/tomchadwin/qgis2web" target="_blank">qgis2web</a> &middot; <a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> &middot; <a href="https://qgis.org">QGIS</a>');

    // Initialize basemaps
    initBasemaps();

    // Add custom controls
    addCustomControls();

    // Setup event listeners
    setupMapEvents();

    // Initialize layers
    initLayers();

    // Add event listeners for navigation
    setupNavigation();

    // Setup panel controls
    setupPanelControls();

    // Setup tab switching
    setupTabs();
}

// ==================== Basemaps ====================
function initBasemaps() {
    basemapLayers = {
        osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }),
        satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri',
            maxZoom: 18
        }),
        terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenTopoMap',
            maxZoom: 17
        }),
        dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© CartoDB',
            maxZoom: 19
        })
    };

    // Add default basemap
    basemapLayers.osm.addTo(map);

    // Populate basemaps panel
    populateBasemaps();
}

function populateBasemaps() {
    const container = document.getElementById('basemaps-container');
    container.innerHTML = '';

    const basemaps = [
        { id: 'osm', name: 'OpenStreetMap', icon: '🗺️' },
        { id: 'satellite', name: 'Satellite', icon: '🛰️' },
        { id: 'terrain', name: 'Terrain', icon: '⛰️' },
        { id: 'dark', name: 'Sombre', icon: '🌙' }
    ];

    basemaps.forEach(bm => {
        const div = document.createElement('div');
        div.className = 'basemap-item' + (bm.id === currentBasemap ? ' active' : '');
        div.innerHTML = `<span class="basemap-preview">${bm.icon}</span><span class="basemap-name">${bm.name}</span>`;
        div.onclick = () => switchBasemap(bm.id);
        container.appendChild(div);
    });
}

function switchBasemap(id) {
    // Remove current basemap
    if (basemapLayers[currentBasemap]) {
        map.removeLayer(basemapLayers[currentBasemap]);
    }
    // Add new basemap
    if (basemapLayers[id]) {
        basemapLayers[id].addTo(map);
        currentBasemap = id;
    }
    // Update UI
    document.querySelectorAll('.basemap-item').forEach((item, idx) => {
        item.classList.toggle('active', 
            item.querySelector('.basemap-name').textContent === 
            document.querySelectorAll('.basemap-item')[Array.from(document.querySelectorAll('.basemap-item')).findIndex(el => el.classList.contains('active'))].querySelector('.basemap-name').textContent
        );
    });
    document.querySelectorAll('.basemap-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.basemap-item').classList.add('active');
}

// ==================== Map Events ====================
function setupMapEvents() {
    // Update coordinates on mouse move
    map.on('mousemove', (e) => {
        document.getElementById('lat').textContent = e.latlng.lat.toFixed(6);
        document.getElementById('lng').textContent = e.latlng.lng.toFixed(6);
        updateDynamicScale();
    });

    // Update zoom level
    map.on('zoomend', () => {
        document.getElementById('zoom').textContent = map.getZoom();
        updateDynamicScale();
    });
}

// ==================== Dynamic Scale ====================
function updateDynamicScale() {
    const zoomLevel = map.getZoom();
    const scaleLength = 100; // pixels
    
    // Calculate meters per pixel
    const bounds = map.getBounds();
    const maxLat = bounds.getNorth();
    const minLat = bounds.getSouth();
    const maxLng = bounds.getEast();
    const minLng = bounds.getWest();
    
    // Simple calculation (more accurate methods exist)
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    
    // Approximate meters per degree at equator
    const metersPerLat = latDiff * 111000 / map.getSize().y;
    const metersPerLng = lngDiff * 111000 * Math.cos((maxLat + minLat) / 2 * Math.PI / 180) / map.getSize().x;
    
    const metersPerPixel = (metersPerLat + metersPerLng) / 2;
    const scaleMeters = scaleLength * metersPerPixel;
    
    let scaleText = '';
    if (scaleMeters >= 1000) {
        scaleText = (scaleMeters / 1000).toFixed(1) + ' km';
    } else {
        scaleText = scaleMeters.toFixed(0) + ' m';
    }
    
    document.getElementById('scale-text').textContent = scaleText;
    document.querySelector('.scale-content').style.width = scaleLength + 'px';
}

// ==================== Custom Controls ====================
function addCustomControls() {
    // Zoom control (top left)
    const zoomControl = L.control.zoom({
        position: 'topleft'
    }).addTo(map);

    // Locate control
    L.control.locate({
        locateOptions: { maxZoom: 19 }
    }).addTo(map);

    // Measure control
    const measureControl = new L.Control.Measure({
        position: 'topleft',
        primaryLengthUnit: 'meters',
        secondaryLengthUnit: 'kilometers',
        primaryAreaUnit: 'sqmeters',
        secondaryAreaUnit: 'hectares'
    });
    measureControl.addTo(map);
    
    // Style measure control icon
    if (document.getElementsByClassName('leaflet-control-measure-toggle').length > 0) {
        document.getElementsByClassName('leaflet-control-measure-toggle')[0].innerHTML = '<i class="fas fa-ruler"></i>';
    }
}

// ==================== Navigation Setup ====================
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            const pageContents = {
                home: `
                    <h3>Bienvenue sur SIG Sénégal</h3>
                    <p>Système d'Information Géographique du Sénégal permettant de visualiser et d'analyser les données territoriales du pays.</p>
                    <h4>Fonctionnalités principales :</h4>
                    <ul>
                        <li>Visualisation de couches cartographiques (Régions, Départements, etc.)</li>
                        <li>Requêtes spatiales et attributaires</li>
                        <li>Téléchargement de données géospatiales</li>
                        <li>Outils de mesure et d'analyse</li>
                    </ul>
                `,
                about: `
                    <h3>À propos de SIG Sénégal</h3>
                    <p>SIG Sénégal est une application web moderne basée sur Leaflet et QGIS2WEB, offrant une interface intuitive pour l'accès aux données géospatiales sénégalaises.</p>
                    <p><strong>Versions :</strong> v1.0</p>
                    <p><strong>Technologies :</strong> Leaflet, QGIS, GeoJSON</p>
                `,
                spatial: `
                    <h3>Requête Spatiale</h3>
                    <p>Sélectionnez une zone sur la carte pour effectuer une requête spatiale.</p>
                    <div style="margin-top: 20px;">
                        <button onclick="initSpatialQuery()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            <i class="fas fa-draw-polygon"></i> Dessiner une zone
                        </button>
                    </div>
                `,
                attribute: `
                    <h3>Requête Attributaire</h3>
                    <p>Interrogez les attributs des entités géographiques.</p>
                    <div style="margin-top: 20px;">
                        <label for="attributeField">Champ :</label>
                        <select id="attributeField" style="width: 100%; padding: 8px; margin: 10px 0; border-radius: 4px; border: 1px solid #ddd;">
                            <option>Région</option>
                            <option>Département</option>
                            <option>Arrondissement</option>
                        </select>
                        <label for="attributeValue">Valeur :</label>
                        <input type="text" id="attributeValue" placeholder="Entrez la valeur" style="width: 100%; padding: 8px; margin: 10px 0; border-radius: 4px; border: 1px solid #ddd;">
                        <button onclick="queryAttributes()" style="width: 100%; padding: 10px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                            Rechercher
                        </button>
                    </div>
                `,
                download: `
                    <h3>Télécharger les données</h3>
                    <p>Sélectionnez les couches à télécharger.</p>
                    <div style="margin-top: 20px;">
                        <label><input type="checkbox" checked> Régions (GeoJSON)</label><br>
                        <label><input type="checkbox" checked> Départements (GeoJSON)</label><br>
                        <label><input type="checkbox"> Routes (GeoJSON)</label><br>
                        <label><input type="checkbox"> Hydrographie (GeoJSON)</label><br>
                        <label><input type="checkbox"> Localités (GeoJSON)</label><br>
                        <button onclick="downloadData()" style="width: 100%; padding: 10px; background: #ffc107; color: black; border: none; border-radius: 5px; cursor: pointer; margin-top: 15px;">
                            <i class="fas fa-download"></i> Télécharger
                        </button>
                    </div>
                `,
                tools: `
                    <h3>Outils disponibles</h3>
                    <p>Utilisez les outils suivants pour analyser vos données :</p>
                    <ul>
                        <li><strong>Zoom :</strong> Utilisez le contrôle de zoom en haut à gauche</li>
                        <li><strong>Mesure :</strong> Cliquez sur l'outil règle pour mesurer les distances</li>
                        <li><strong>Localisation :</strong> Cliquez sur l'outil de positionnement</li>
                        <li><strong>Recherche :</strong> Utilisez la barre de recherche pour localiser un lieu</li>
                    </ul>
                `
            };

            const title = {
                home: 'Accueil',
                about: 'À propos',
                spatial: 'Requête Spatiale',
                attribute: 'Requête Attributaire',
                download: 'Télécharger les données',
                tools: 'Outils'
            };

            openModal(title[page] || page, pageContents[page] || '');
        });
    });
}

function openModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('pageModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('pageModal').style.display = 'none';
}

// Close modal on background click
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('pageModal');
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});

// ==================== Panel Controls ====================
function setupPanelControls() {
    const leftToggle = document.querySelector('.left-panel .panel-toggle');
    const leftPanel = document.querySelector('.left-panel');

    if (leftToggle) {
        leftToggle.addEventListener('click', () => {
            leftPanel.classList.toggle('collapsed');
        });
    }
}

// ==================== Tab Switching ====================
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });
}

// ==================== Layer Functions ====================
function initLayers() {
    const autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});

    // Helper functions for layers
    function highlightFeature(e) {
        const layer = e.target;
        if (e.target.feature.geometry.type === 'LineString' || e.target.feature.geometry.type === 'MultiLineString') {
            layer.setStyle({ color: 'rgba(255, 255, 0, 1.00)' });
        } else {
            layer.setStyle({ fillColor: 'rgba(255, 255, 0, 1.00)', fillOpacity: 1 });
        }
        layer.openPopup();
    }

    function removeEmptyRowsFromPopupContent(content, feature) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const rows = tempDiv.querySelectorAll('tr');
        for (let i = rows.length - 1; i >= 0; i--) {
            const td = rows[i].querySelector('td.visible-with-data');
            const key = td ? td.id : '';
            if (td && td.classList.contains('visible-with-data') && feature.properties[key] == null) {
                rows[i].parentNode.removeChild(rows[i]);
            }
        }
        return tempDiv.innerHTML;
    }

    function addClassToPopupIfMedia(content, popup) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const imgTd = tempDiv.querySelector('td img');
        if (imgTd) {
            const src = imgTd.getAttribute('src');
            if (/\.(jpg|jpeg|png|gif|bmp|webp|avif)$/i.test(src)) {
                popup._contentNode.classList.add('media');
                setTimeout(() => popup.update(), 10);
            }
        }
    }

    // ==================== Region Layer ====================
    function pop_Region_0(feature, layer) {
        layer.on({
            mouseout: (e) => {
                for (const i in e.target._eventParents) {
                    if (typeof e.target._eventParents[i].resetStyle === 'function') {
                        e.target._eventParents[i].resetStyle(e.target);
                    }
                }
                if (typeof layer.closePopup === 'function') {
                    layer.closePopup();
                } else {
                    layer.eachLayer((f) => f.closePopup());
                }
            },
            mouseover: highlightFeature,
        });
        const popupContent = `<table>
            <tr><td colspan="2">${feature.properties['OBJECTID_1'] ? autolinker.link(String(feature.properties['OBJECTID_1']).replace(/'/g, '\'').toLocaleString()) : ''}</td></tr>
            <tr><td colspan="2">${feature.properties['Statut'] ? autolinker.link(String(feature.properties['Statut']).replace(/'/g, '\'').toLocaleString()) : ''}</td></tr>
            <tr><td colspan="2">${feature.properties['Code'] ? autolinker.link(String(feature.properties['Code']).replace(/'/g, '\'').toLocaleString()) : ''}</td></tr>
            <tr><td colspan="2"><strong>${feature.properties['Région'] ? autolinker.link(String(feature.properties['Région']).replace(/'/g, '\'').toLocaleString()) : ''}</strong></td></tr>
        </table>`;
        const content = removeEmptyRowsFromPopupContent(popupContent, feature);
        layer.on('popupopen', (e) => addClassToPopupIfMedia(content, e.popup));
        layer.bindPopup(content, { maxHeight: 400 });
    }

    function style_Region_0_0() {
        return {
            pane: 'pane_Region_0',
            opacity: 1,
            color: 'rgba(35,35,35,1.0)',
            dashArray: '',
            lineCap: 'butt',
            lineJoin: 'miter',
            weight: 1.0,
            fill: true,
            fillOpacity: 1,
            fillColor: 'rgba(190,178,151,1.0)',
            interactive: true,
        }
    }

    map.createPane('pane_Region_0');
    map.getPane('pane_Region_0').style.zIndex = 400;
    map.getPane('pane_Region_0').style['mix-blend-mode'] = 'normal';

    const layer_Region_0 = new L.geoJson(json_Region_0, {
        attribution: '',
        interactive: true,
        dataVar: 'json_Region_0',
        layerName: 'layer_Region_0',
        pane: 'pane_Region_0',
        onEachFeature: pop_Region_0,
        style: style_Region_0_0,
    });

    map.addLayer(layer_Region_0);
    allLayers.push({ name: 'Régions', layer: layer_Region_0, data: json_Region_0 });

    // ==================== Departement Layer ====================
    function pop_Departement_1(feature, layer) {
        layer.on({
            mouseout: (e) => {
                for (const i in e.target._eventParents) {
                    if (typeof e.target._eventParents[i].resetStyle === 'function') {
                        e.target._eventParents[i].resetStyle(e.target);
                    }
                }
                if (typeof layer.closePopup === 'function') {
                    layer.closePopup();
                } else {
                    layer.eachLayer((f) => f.closePopup());
                }
            },
            mouseover: highlightFeature,
        });
        const popupContent = `<table>
            <tr><td><strong>Région:</strong></td><td>${feature.properties['Région'] || ''}</td></tr>
            <tr><td><strong>Département:</strong></td><td>${feature.properties['Dept'] || ''}</td></tr>
            <tr><td><strong>Code:</strong></td><td>${feature.properties['Cod_Dept'] || ''}</td></tr>
        </table>`;
        const content = removeEmptyRowsFromPopupContent(popupContent, feature);
        layer.on('popupopen', (e) => addClassToPopupIfMedia(content, e.popup));
        layer.bindPopup(content, { maxHeight: 400 });
    }

    function style_Departement_1_0() {
        return {
            pane: 'pane_Departement_1',
            opacity: 1,
            color: 'rgba(35,35,35,1.0)',
            dashArray: '',
            lineCap: 'butt',
            lineJoin: 'miter',
            weight: 1.0,
            fill: true,
            fillOpacity: 1,
            fillColor: 'rgba(183,72,75,1.0)',
            interactive: true,
        }
    }

    map.createPane('pane_Departement_1');
    map.getPane('pane_Departement_1').style.zIndex = 401;
    map.getPane('pane_Departement_1').style['mix-blend-mode'] = 'normal';

    const layer_Departement_1 = new L.geoJson(json_Departement_1, {
        attribution: '',
        interactive: true,
        dataVar: 'json_Departement_1',
        layerName: 'layer_Departement_1',
        pane: 'pane_Departement_1',
        onEachFeature: pop_Departement_1,
        style: style_Departement_1_0,
    });

    map.addLayer(layer_Departement_1);
    allLayers.push({ name: 'Départements', layer: layer_Departement_1, data: json_Departement_1 });

    // ==================== Arrondissement Layer ====================
    const layer_Arrondissement_2 = createArrondissementLayer();
    map.addLayer(layer_Arrondissement_2);
    allLayers.push({ name: 'Arrondissements', layer: layer_Arrondissement_2, data: json_Arrondissement_2 });

    // ==================== Routes Layer ====================
    const layer_Routes_3 = createRoutesLayer();
    map.addLayer(layer_Routes_3);
    allLayers.push({ name: 'Routes', layer: layer_Routes_3, data: json_Routes_3 });

    // ==================== Hydrographie Layer ====================
    const layer_Hydrographie_4 = createHydrographieLayer();
    map.addLayer(layer_Hydrographie_4);
    allLayers.push({ name: 'Hydrographie', layer: layer_Hydrographie_4, data: json_Hydrographie_4 });

    // ==================== Localites Layer ====================
    const layer_localites_5 = createLocalitesLayer();
    const cluster_localites_5 = new L.MarkerClusterGroup({
        showCoverageOnHover: false,
        spiderfyDistanceMultiplier: 2
    });
    cluster_localites_5.addLayer(layer_localites_5);
    cluster_localites_5.addTo(map);
    allLayers.push({ name: 'Localités', layer: cluster_localites_5, data: json_localites_5 });

    // Populate legend
    populateLegend();

    // Populate layers panel
    populateLayersPanel(layer_Region_0, layer_Departement_1, layer_Arrondissement_2, layer_Routes_3, layer_Hydrographie_4, cluster_localites_5);
}

function createArrondissementLayer() {
    const autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});

    function pop_Arrondissement_2(feature, layer) {
        layer.on({
            mouseout: (e) => {
                for (const i in e.target._eventParents) {
                    if (typeof e.target._eventParents[i].resetStyle === 'function') {
                        e.target._eventParents[i].resetStyle(e.target);
                    }
                }
            },
            mouseover: (e) => {
                e.target.setStyle({ fillColor: 'rgba(255, 255, 0, 1.00)', fillOpacity: 1 });
                e.target.openPopup();
            },
        });
        const popupContent = `<table>
            <tr><td><strong>Arrondissement:</strong></td><td>${feature.properties['arr'] || ''}</td></tr>
            <tr><td><strong>Région:</strong></td><td>${feature.properties['reg'] || ''}</td></tr>
            <tr><td><strong>Département:</strong></td><td>${feature.properties['dept'] || ''}</td></tr>
        </table>`;
        layer.bindPopup(popupContent, { maxHeight: 400 });
    }

    map.createPane('pane_Arrondissement_2');
    map.getPane('pane_Arrondissement_2').style.zIndex = 402;

    return new L.geoJson(json_Arrondissement_2, {
        attribution: '',
        interactive: true,
        pane: 'pane_Arrondissement_2',
        onEachFeature: pop_Arrondissement_2,
        style: () => ({
            opacity: 1,
            color: 'rgba(35,35,35,1.0)',
            weight: 1.0,
            fill: true,
            fillOpacity: 1,
            fillColor: 'rgba(232,113,141,1.0)',
            interactive: true,
        }),
    });
}

function createRoutesLayer() {
    const autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});

    function pop_Routes_3(feature, layer) {
        const popupContent = `<table>
            <tr><td><strong>Fonction:</strong></td><td>${feature.properties['FONCTION'] || ''}</td></tr>
            <tr><td><strong>Code:</strong></td><td>${feature.properties['CODE'] || ''}</td></tr>
        </table>`;
        layer.bindPopup(popupContent, { maxHeight: 400 });
    }

    function style_Routes_3_0(feature) {
        const colors = {
            'Autres pistes': 'rgba(108,200,32,1.0)',
            'Autres routes': 'rgba(207,71,189,1.0)',
            'Chemin de fer': 'rgba(29,161,227,1.0)',
            'Digues': 'rgba(104,113,238,1.0)',
            'Piste automobile': 'rgba(108,200,32,1.0)',
            'Piste secondaire': 'rgba(133,149,135,1.0)',
            'Route principale': 'rgba(21,210,163,1.0)',
            'Route principale à 2 voies': 'rgba(222,214,60,1.0)',
            'Route principale à 4 voies': 'rgba(216,86,119,1.0)',
        };
        return {
            opacity: 1,
            color: colors[feature.properties['FONCTION']] || 'rgba(108,200,32,1.0)',
            weight: 1.0,
            interactive: true,
        }
    }

    map.createPane('pane_Routes_3');
    map.getPane('pane_Routes_3').style.zIndex = 403;

    return new L.geoJson(json_Routes_3, {
        attribution: '',
        interactive: true,
        pane: 'pane_Routes_3',
        onEachFeature: pop_Routes_3,
        style: style_Routes_3_0,
    });
}

function createHydrographieLayer() {
    function pop_Hydrographie_4(feature, layer) {
        const popupContent = `<table>
            <tr><td><strong>Nom:</strong></td><td>${feature.properties['NOM'] || ''}</td></tr>
            <tr><td><strong>Libellé:</strong></td><td>${feature.properties['LIBELLE'] || ''}</td></tr>
        </table>`;
        layer.bindPopup(popupContent, { maxHeight: 400 });
    }

    map.createPane('pane_Hydrographie_4');
    map.getPane('pane_Hydrographie_4').style.zIndex = 404;

    return new L.geoJson(json_Hydrographie_4, {
        attribution: '',
        interactive: true,
        pane: 'pane_Hydrographie_4',
        onEachFeature: pop_Hydrographie_4,
        style: () => ({
            opacity: 1,
            color: 'rgba(152,125,183,1.0)',
            weight: 1.0,
            interactive: true,
        }),
    });
}

function createLocalitesLayer() {
    function pop_localites_5(feature, layer) {
        const popupContent = `<table>
            <tr><td><strong>Localité:</strong></td><td>${feature.properties['NOM'] || ''}</td></tr>
            <tr><td><strong>Village:</strong></td><td>${feature.properties['NUM_VILLAG'] || ''}</td></tr>
        </table>`;
        layer.bindPopup(popupContent, { maxHeight: 400 });
    }

    map.createPane('pane_localites_5');
    map.getPane('pane_localites_5').style.zIndex = 405;

    return new L.geoJson(json_localites_5, {
        attribution: '',
        interactive: true,
        pane: 'pane_localites_5',
        onEachFeature: pop_localites_5,
        pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
            radius: 4.0,
            opacity: 1,
            color: 'rgba(35,35,35,1.0)',
            weight: 1,
            fill: true,
            fillOpacity: 1,
            fillColor: 'rgba(225,89,137,1.0)',
            interactive: true,
        }),
    });
}

function populateLayersPanel(...layers) {
    const container = document.getElementById('layers-panel');
    container.innerHTML = '';

    const layerNames = ['Régions', 'Départements', 'Arrondissements', 'Routes', 'Hydrographie', 'Localités'];

    layers.forEach((layer, idx) => {
        const div = document.createElement('div');
        div.className = 'layer-item';
        div.innerHTML = `
            <label>
                <input type="checkbox" class="layer-toggle" data-index="${idx}" checked>
                <span>${layerNames[idx]}</span>
            </label>
        `;
        container.appendChild(div);

        div.querySelector('.layer-toggle').addEventListener('change', (e) => {
            if (e.target.checked) {
                map.addLayer(layer);
            } else {
                map.removeLayer(layer);
            }
        });
    });
}

function populateLegend() {
    const container = document.getElementById('legend-container');
    container.innerHTML = `
        <h4 style="margin-top: 0; color: #667eea; font-size: 13px;">Couches Cartographiques</h4>
        <div class="legend-item">
            <div class="legend-color" style="background: rgba(190,178,151,1.0);"></div>
            <span>Régions</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background: rgba(183,72,75,1.0);"></div>
            <span>Départements</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background: rgba(232,113,141,1.0);"></div>
            <span>Arrondissements</span>
        </div>
        <h4 style="color: #667eea; font-size: 13px; margin-top: 15px;">Routes</h4>
        <div class="legend-item">
            <div class="legend-color" style="background: rgba(21,210,163,1.0);"></div>
            <span>Route principale</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background: rgba(222,214,60,1.0);"></div>
            <span>Route 2 voies</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background: rgba(216,86,119,1.0);"></div>
            <span>Route 4 voies</span>
        </div>
        <h4 style="color: #667eea; font-size: 13px; margin-top: 15px;">Autres</h4>
        <div class="legend-item">
            <div class="legend-color" style="background: rgba(152,125,183,1.0);"></div>
            <span>Hydrographie</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background: rgba(225,89,137,1.0);"></div>
            <span>Localités</span>
        </div>
    `;
}

// ==================== Query Functions ====================
function initSpatialQuery() {
    alert('Fonctionnalité de requête spatiale - À développer avec une bibliothèque de dessin (Leaflet Draw)');
}

function queryAttributes() {
    const field = document.getElementById('attributeField').value;
    const value = document.getElementById('attributeValue').value;
    
    if (!value) {
        alert('Veuillez entrer une valeur');
        return;
    }
    
    alert(`Recherche de ${field} = "${value}"`);
    // Implement actual query here
}

function downloadData() {
    const checkboxes = document.querySelectorAll('#modalBody input[type="checkbox"]:checked');
    const selectedLayers = Array.from(checkboxes).map(cb => cb.parentElement.textContent.trim());
    
    alert(`Téléchargement des données :\n${selectedLayers.join('\n')}`);
    // Implement actual download here
}

// ==================== Initialize on Page Load ====================
document.addEventListener('DOMContentLoaded', () => {
    initMap();
});
