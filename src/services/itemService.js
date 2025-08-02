import api from './api';

export default {
    async getSingleOre(oreName) {
        try {
            const response = await api.get('name/' + oreName);
            console.log(response.data);
            return response;
        } catch (error) {
            console.error(`Erreur lors de la récupération du minerai ${oreName}:`, error);
            throw error;
        }
    },

    async getWood() {
        let response = []
        const ores = [
            "T2_WOOD","T3_WOOD",
            "T4_WOOD","T4_WOOD_LEVEL2@2","T4_WOOD_LEVEL3@3",
            "T5_WOOD","T5_WOOD_LEVEL2@2","T5_WOOD_LEVEL3@3",
            "T6_WOOD","T6_WOOD_LEVEL2@2","T6_WOOD_LEVEL3@3",
        ]
        for (let i = 0; i < ores.length; i++) {
            response.push(await api.get('name/' + ores[i]));
        }
        return response;
    },
    async getCotton() {
        let response = []
        const ores = [
            "T2_FIBER","T3_FIBER",
            "T4_FIBER","T4_FIBER_LEVEL2@2","T4_FIBER_LEVEL3@3",
            "T5_FIBER","T5_FIBER_LEVEL2@2","T5_FIBER_LEVEL3@3",
            "T6_FIBER","T6_FIBER_LEVEL2@2","T6_FIBER_LEVEL3@3",
        ]
        for (let i = 0; i < ores.length; i++) {
            response.push(await api.get('name/' + ores[i]));
        }
        return response;
    },
    async getLeather() {
        let response = []
        const ores = [
            "T2_LEATHER","T3_LEATHER",
            "T4_LEATHER","T4_LEATHER_LEVEL2@2","T4_LEATHER_LEVEL3@3",
            "T5_LEATHER","T5_LEATHER_LEVEL2@2","T5_LEATHER_LEVEL3@3",
            "T6_LEATHER","T6_LEATHER_LEVEL2@2","T6_LEATHER_LEVEL3@3",
        ]
        for (let i = 0; i < ores.length; i++) {
            response.push(await api.get('name/' + ores[i]));
        }
        return response;
    },
    async getMetalBar() {
        let response = []
        const ores = [
            "T2_METALBAR","T3_METALBAR",
            "T4_METALBAR","T4_METALBAR_LEVEL2@2","T4_METALBAR_LEVEL3@3",
            "T5_METALBAR","T5_METALBAR_LEVEL2@2","T5_METALBAR_LEVEL3@3",
            "T6_METALBAR","T6_METALBAR_LEVEL2@2","T6_METALBAR_LEVEL3@3",
        ]
        for (let i = 0; i < ores.length; i++) {
            response.push(await api.get('name/' + ores[i]));
        }
        return response;
    },
    async getCloths() {
        let response = []
        const ores = [
            "T2_CLOTH","T3_CLOTH",
            "T4_CLOTH","T4_CLOTH_LEVEL2@2","T4_CLOTH_LEVEL3@3",
            "T5_CLOTH","T5_CLOTH_LEVEL2@2","T5_CLOTH_LEVEL3@3",
            "T6_CLOTH","T6_CLOTH_LEVEL2@2","T6_CLOTH_LEVEL3@3",
        ]
        for (let i = 0; i < ores.length; i++) {
            response.push(await api.get('name/' + ores[i]));
        }
        return response;
    },
    async getHide() {
        let response = []
        const ores = [
            "T2_HIDE","T3_HIDE",
            "T4_HIDE","T4_HIDE_LEVEL2@2","T4_HIDE_LEVEL3@3",
            "T5_HIDE","T5_HIDE_LEVEL2@2","T5_HIDE_LEVEL3@3",
            "T6_HIDE","T6_HIDE_LEVEL2@2","T6_HIDE_LEVEL3@3",
        ]
        for (let i = 0; i < ores.length; i++) {
            response.push(await api.get('name/' + ores[i]));
        }
        return response;
    },
    async getStone() {
        let response = []
        const ores = [
            "T2_ROCK","T3_ROCK",
            "T4_ROCK",
            "T5_ROCK",
            "T6_ROCK",
        ]
        for (let i = 0; i < ores.length; i++) {
            response.push(await api.get('name/' + ores[i]));
        }
        return response;
    },
    async getStoneBlock() {
        let response = []
        const ores = [
            "T2_STONEBLOCK","T3_STONEBLOCK",
            "T4_STONEBLOCK",
            "T5_STONEBLOCK",
            "T6_STONEBLOCK",
        ]
        for (let i = 0; i < ores.length; i++) {
            response.push(await api.get('name/' + ores[i]));
        }
        return response;
    },
    async getPlanks() {
        let response = []
        const ores = [
            "T2_PLANKS","T3_PLANKS",
            "T4_PLANKS","T4_PLANKS_LEVEL2@2","T4_PLANKS_LEVEL3@3",
            "T5_PLANKS","T5_PLANKS_LEVEL2@2","T5_PLANKS_LEVEL3@3",
            "T6_PLANKS","T6_PLANKS_LEVEL2@2","T6_PLANKS_LEVEL3@3",
        ]
        for (let i = 0; i < ores.length; i++) {
            response.push(await api.get('name/' + ores[i]));
        }
        return response;
    },

    async getPricesForCharts(uniqueName) {
        return api.get("name/time/" + uniqueName)
    }
};