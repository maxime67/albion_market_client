<template>
  <div class="p-4">
    <div class="bg-gray-800 rounded-lg p-6 mb-6">
      <div class="flex flex-col items-center justify-center gap-4 mb-4">
        <div class="flex flex-wrap gap-4 justify-center">
          <button
              v-for="tier in [2, 3, 4, 5, 6]"
              :key="tier"
              @click="selectedTier = tier"
              :class="selectedTier === tier ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
              class="px-4 py-2 rounded-lg font-medium"
          >
            Tier {{ tier }}
          </button>
        </div>

        <div class="flex flex-wrap gap-4 justify-center">
          <button
              v-for="enchant in enchantments"
              :key="enchant.value"
              @click="selectedEnchantment = enchant.value"
              :class="enchant.color"
              class="px-4 py-2 rounded-lg font-medium"
          >
            {{ enchant.label }}
          </button>
        </div>
        <button
            @click="loadData"
            :disabled="loading"
            class="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <div v-if="loading"
               class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {{ loading ? 'Chargement...' : 'Charger les données' }}
        </button>
      </div>

      <div class="flex justify-between items-center">
        <div class="text-2xl text-gray-400">
          {{ selectedTier }}.{{ enchantments.find(e => e.value === selectedEnchantment)?.label }}
        </div>
      </div>
    </div>

    <div v-if="data.length && !loading" class="bg-gray-800 rounded-lg p-6">
      <div v-for="item in data" :key="item.id" class="p-3">
        <item-component :item="item"></item-component>
      </div>
    </div>

    <div v-else-if="!loading" class="bg-gray-800 rounded-lg p-6 text-center">
      <div class="text-gray-400 text-lg">Aucune donnée disponible</div>
      <div class="text-gray-500 text-sm mt-2">
        Sélectionnez un tier et un enchantement, puis cliquez sur "Charger les données"
      </div>
    </div>

    <div v-if="loading" class="bg-gray-800 rounded-lg p-6 text-center">
      <div class="flex items-center justify-center gap-2">
        <div class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span class="text-white">Chargement des items...</span>
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
      {value: 0, label: '0', color: "bg-gradient-to-br from-purple-400 to-purple-700"},
      {value: 1, label: '1', color: "bg-gradient-to-br from-green-400 to-green-700"},
      {value: 2, label: '2', color: "bg-gradient-to-br from-blue-400 to-blue-700"},
      {value: 3, label: '3', color: "bg-gradient-to-br from-purple-400 to-purple-700"},
      {value: 4, label: '4', color: "bg-gradient-to-br from-yellow-400 to-yellow-700"}
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