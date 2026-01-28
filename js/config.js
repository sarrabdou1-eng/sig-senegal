/**
 * Configuration SIG Sénégal
 * Paramètres globaux de l'application
 */

const APP_CONFIG = {
    // Informations générales
    appName: 'SIG Sénégal',
    version: '1.0.0',
    appTitle: 'Système d\'Information Géographique du Sénégal',
    
    // Configuration de la carte
    map: {
        minZoom: 1,
        maxZoom: 20,
        defaultZoom: 8,
        bounds: [[14.455587820623908,-15.038297818826887],[15.590279642926522,-13.401600485252754]],
        center: [14.5, -14.2]
    },
    
    // Basemaps disponibles
    basemaps: [
        {
            id: 'osm',
            name: 'OpenStreetMap',
            icon: '🗺️',
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        },
        {
            id: 'satellite',
            name: 'Satellite',
            icon: '🛰️',
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attribution: '© Esri',
            maxZoom: 18
        },
        {
            id: 'terrain',
            name: 'Terrain',
            icon: '⛰️',
            url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            attribution: '© OpenTopoMap',
            maxZoom: 17
        },
        {
            id: 'dark',
            name: 'Sombre',
            icon: '🌙',
            url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            attribution: '© CartoDB',
            maxZoom: 19
        }
    ],
    
    // Couches disponibles
    layers: [
        {
            id: 'Region_0',
            name: 'Régions',
            dataVar: 'json_Region_0',
            zIndex: 400,
            fillColor: 'rgba(190,178,151,1.0)',
            strokeColor: 'rgba(35,35,35,1.0)',
            visible: true
        },
        {
            id: 'Departement_1',
            name: 'Départements',
            dataVar: 'json_Departement_1',
            zIndex: 401,
            fillColor: 'rgba(183,72,75,1.0)',
            strokeColor: 'rgba(35,35,35,1.0)',
            visible: true
        },
        {
            id: 'Arrondissement_2',
            name: 'Arrondissements',
            dataVar: 'json_Arrondissement_2',
            zIndex: 402,
            fillColor: 'rgba(232,113,141,1.0)',
            strokeColor: 'rgba(35,35,35,1.0)',
            visible: true
        },
        {
            id: 'Routes_3',
            name: 'Routes',
            dataVar: 'json_Routes_3',
            zIndex: 403,
            visible: true
        },
        {
            id: 'Hydrographie_4',
            name: 'Hydrographie',
            dataVar: 'json_Hydrographie_4',
            zIndex: 404,
            strokeColor: 'rgba(152,125,183,1.0)',
            visible: true
        },
        {
            id: 'localites_5',
            name: 'Localités',
            dataVar: 'json_localites_5',
            zIndex: 405,
            fillColor: 'rgba(225,89,137,1.0)',
            visible: true
        }
    ],
    
    // Configuration des contrôles
    controls: {
        zoom: {
            position: 'topleft',
            enabled: true
        },
        locate: {
            position: 'topleft',
            maxZoom: 19,
            enabled: true
        },
        measure: {
            position: 'topleft',
            enabled: true,
            primaryLengthUnit: 'meters',
            secondaryLengthUnit: 'kilometers',
            primaryAreaUnit: 'sqmeters',
            secondaryAreaUnit: 'hectares'
        },
        coordinates: {
            position: 'bottomleft',
            enabled: true,
            precision: 6
        },
        scale: {
            position: 'bottomleft',
            enabled: true
        }
    },
    
    // Couleurs et styles
    theme: {
        primary: '#667eea',
        secondary: '#764ba2',
        success: '#28a745',
        warning: '#ffc107',
        danger: '#dc3545',
        info: '#17a2b8',
        light: '#f8f9fa',
        dark: '#343a40'
    },
    
    // Modaux
    modals: {
        home: {
            title: 'Accueil',
            icon: 'fas fa-home'
        },
        about: {
            title: 'À propos',
            icon: 'fas fa-info-circle'
        },
        spatial: {
            title: 'Requête Spatiale',
            icon: 'fas fa-search'
        },
        attribute: {
            title: 'Requête Attributaire',
            icon: 'fas fa-table'
        },
        download: {
            title: 'Télécharger les données',
            icon: 'fas fa-download'
        },
        tools: {
            title: 'Outils',
            icon: 'fas fa-tools'
        }
    },
    
    // URLs et API
    apis: {
        nominatim: 'https://nominatim.openstreetmap.org/search?format=geojson&addressdetails=1&',
        ban: 'https://api-adresse.data.gouv.fr/search/?'
    },
    
    // Textes et messages
    messages: {
        loadingLayers: 'Chargement des couches...',
        layersLoaded: 'Couches chargées avec succès',
        errorLoading: 'Erreur lors du chargement',
        selectArea: 'Sélectionnez une zone sur la carte',
        noResults: 'Aucun résultat trouvé'
    }
};

// Exporter la configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APP_CONFIG;
}
