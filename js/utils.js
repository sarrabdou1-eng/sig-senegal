/**
 * Utilitaires SIG Sénégal
 * Fonctions génériques et utiles
 */

const SIGUtils = {
    
    /**
     * Formate les coordonnées pour l'affichage
     */
    formatCoordinates: (lat, lng, precision = 6) => {
        return {
            lat: parseFloat(lat).toFixed(precision),
            lng: parseFloat(lng).toFixed(precision)
        };
    },

    /**
     * Calcule la distance entre deux points (formule de Haversine)
     */
    calculateDistance: (lat1, lng1, lat2, lng2) => {
        const R = 6371; // Rayon terrestre en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    },

    /**
     * Exporte les données au format GeoJSON
     */
    exportGeoJSON: (data, filename = 'data.geojson') => {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Exporte les données au format CSV
     */
    exportCSV: (features, filename = 'data.csv') => {
        if (!features || features.length === 0) {
            alert('Aucune donnée à exporter');
            return;
        }

        // Récupérer les clés depuis les propriétés
        const properties = features[0].properties;
        const keys = Object.keys(properties);
        
        // Créer l'en-tête
        let csv = keys.join(',') + '\n';
        
        // Ajouter les lignes
        features.forEach(feature => {
            const values = keys.map(key => {
                const value = feature.properties[key];
                // Echapper les valeurs contenant des virgules
                return typeof value === 'string' && value.includes(',') 
                    ? `"${value}"` 
                    : value;
            });
            csv += values.join(',') + '\n';
        });

        // Télécharger le fichier
        const dataBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(dataBlob);
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Filtre les features par attribut
     */
    filterFeatures: (features, attribute, value) => {
        return features.filter(feature => {
            const featureValue = String(feature.properties[attribute]).toLowerCase();
            return featureValue === String(value).toLowerCase();
        });
    },

    /**
     * Filtre les features par zone géographique (bounding box)
     */
    filterFeaturesByBounds: (features, bounds) => {
        return features.filter(feature => {
            if (feature.geometry.type === 'Point') {
                const coords = feature.geometry.coordinates;
                return coords[1] >= bounds._southWest.lat &&
                       coords[1] <= bounds._northEast.lat &&
                       coords[0] >= bounds._southWest.lng &&
                       coords[0] <= bounds._northEast.lng;
            }
            // Pour les autres types de géométrie, retourner true
            return true;
        });
    },

    /**
     * Calque les statistiques sur une couche
     */
    getLayerStatistics: (features) => {
        const stats = {
            count: features.length,
            types: {},
            boundingBox: null
        };

        let minLat = Infinity, maxLat = -Infinity;
        let minLng = Infinity, maxLng = -Infinity;

        features.forEach(feature => {
            const type = feature.geometry.type;
            stats.types[type] = (stats.types[type] || 0) + 1;

            // Calculer la bounding box
            if (feature.geometry.type === 'Point') {
                const [lng, lat] = feature.geometry.coordinates;
                minLat = Math.min(minLat, lat);
                maxLat = Math.max(maxLat, lat);
                minLng = Math.min(minLng, lng);
                maxLng = Math.max(maxLng, lng);
            }
        });

        if (minLat !== Infinity) {
            stats.boundingBox = [[minLat, minLng], [maxLat, maxLng]];
        }

        return stats;
    },

    /**
     * Crée une couleur aléatoire
     */
    getRandomColor: () => {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    /**
     * Valide les coordonnées
     */
    isValidCoordinate: (lat, lng) => {
        return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    },

    /**
     * Formate les propriétés pour l'affichage
     */
    formatProperties: (properties) => {
        let html = '<table style="font-size: 12px; width: 100%;">';
        for (const [key, value] of Object.entries(properties)) {
            html += `<tr><td style="font-weight: bold;">${key}:</td><td>${value || '-'}</td></tr>`;
        }
        html += '</table>';
        return html;
    },

    /**
     * Affiche une notification
     */
    showNotification: (message, type = 'info', duration = 3000) => {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 3000;
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    },

    /**
     * Formate une date
     */
    formatDate: (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(date).toLocaleDateString('fr-FR', options);
    },

    /**
     * Génère un ID unique
     */
    generateId: () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Copie le texte dans le presse-papiers
     */
    copyToClipboard: (text) => {
        navigator.clipboard.writeText(text).then(() => {
            SIGUtils.showNotification('Copié dans le presse-papiers!', 'success');
        });
    },

    /**
     * Obtient l'URL de partage pour une vue
     */
    getShareUrl: (lat, lng, zoom) => {
        const baseUrl = window.location.origin + window.location.pathname;
        return `${baseUrl}#map=${zoom}/${lat.toFixed(5)}/${lng.toFixed(5)}`;
    }
};

// Exporter les utilitaires
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SIGUtils;
}
