<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
    <div class="h-16"></div>

    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 25% 25%, #ffffff 2px, transparent 2px), radial-gradient(circle at 75% 75%, #ffffff 2px, transparent 2px); background-size: 50px 50px;"></div>
    </div>


    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <div class="relative z-10  mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">

      <div class="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 border border-white/20">
        <div class="flex flex-col items-center justify-center gap-6">

          <div class="w-full">
            <div class="flex flex-wrap gap-3 justify-center">
              <button
                  v-for="tier in [2, 3, 4, 5, 6]"
                  :key="tier"
                  @click="selectedTier = tier"
                  :class="[
                    'px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4',
                    selectedTier === tier
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg focus:ring-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 focus:ring-gray-300'
                  ]"
              >
                Tier {{ tier }}
              </button>
            </div>
          </div>

          <div class="w-full">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 text-center">Niveau d'enchantement</h3>
            <div class="flex flex-wrap gap-3 justify-center">
              <button
                  v-for="enchant in enchantments"
                  :key="enchant.value"
                  @click="selectedEnchantment = enchant.value"
                  :class="[
                    'px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4',
                    selectedEnchantment === enchant.value
                      ? `${enchant.color} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                  ]"
              >
                {{ enchant.label }}
              </button>
            </div>
          </div>

          <button
              @click="loadData"
              :disabled="loading"
              class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300"
          >
            <div v-if="loading"
                 class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            {{ loading ? 'Chargement en cours...' : 'Charger les données' }}
          </button>

          <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
            <div class="text-center">
              <span class="text-sm text-gray-600">Configuration actuelle:</span>
              <div class="text-xl font-bold text-gray-900 mt-1">
                Tier {{ selectedTier }}.{{ enchantments.find(e => e.value === selectedEnchantment)?.label }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="data.length && !loading" class="space-y-8">
        <div v-for="item in data" :key="item.id" class="animate-fade-in-up">
          <item-component :item="item"></item-component>
        </div>
      </div>

      <div v-else-if="!loading" class="text-center py-20">
        <div class="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-12 border border-white/20 max-w-md mx-auto">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Aucune donnée disponible</h3>
          <p class="text-gray-600 leading-relaxed">
            Sélectionnez un tier et un enchantement, puis cliquez sur "Charger les données" pour afficher les informations du marché.
          </p>
        </div>
      </div>

      <div v-if="loading" class="text-center py-20">
        <div class="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-12 border border-white/20 max-w-md mx-auto">
          <div class="flex flex-col items-center gap-6">
            <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div class="text-center">
              <h3 class="text-xl font-bold text-gray-900 mb-2">Chargement des données</h3>
              <p class="text-gray-600">Récupération des informations du marché...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, computed, onMounted} from 'vue';
import itemService from "@/services/itemService.js";
import ItemComponent from "@/components/ItemComponent.vue";
import {useRoute} from "vue-router";

export default {
  components: {ItemComponent},
  setup() {
    const data = ref([]);
    const loading = ref(false);
    const selectedTier = ref(4);
    const selectedEnchantment = ref(0);
    const route = useRoute()

    const enchantments = [
      {value: 0, label: '0', color: "bg-gradient-to-br from-gray-500 to-gray-700"},
      {value: 1, label: '1', color: "bg-gradient-to-br from-green-500 to-green-700"},
      {value: 2, label: '2', color: "bg-gradient-to-br from-blue-500 to-blue-700"},
      {value: 3, label: '3', color: "bg-gradient-to-br from-purple-500 to-purple-700"},
      {value: 4, label: '4', color: "bg-gradient-to-br from-yellow-500 to-orange-600"}
    ];

    const itemName = computed(() => {
      const tier = selectedTier.value;
      const enchant = selectedEnchantment.value;
      const item = route.params.item.toUpperCase()
      let name = `T${tier}_${item}`;
      if (enchant > 0 && tier > 3 && item !== "STONEBLOCK" && item !== "STONE") {
        name += `_LEVEL${enchant}@${enchant}`;
      }
      return name;
    });

    const loadData = async () => {
      loading.value = true;
      try {
        const response = await itemService.getSingleItem(itemName.value);
        data.value = [response];
      } catch (error) {
        console.error('Erreur:', error);
        data.value = [];
      } finally {
        loading.value = false;
      }
    };

    onMounted(loadData);

    return {
      data,
      loading,
      selectedTier,
      selectedEnchantment,
      enchantments,
      loadData
    };
  }
};
</script>

<style scoped>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #7c3aed);
}
</style>