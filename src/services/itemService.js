import api from './api';

export default {
    async getSingleItem(oreName) {
        try {
            const response = await api.get('name/' + oreName);
            return response;
        } catch (error) {
            console.error(`Erreur lors de la récupération du minerai ${oreName}:`, error);
            throw error;
        }
    },

};