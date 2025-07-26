<script setup>
import { computed } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const item = computed(() => props.item);

const formatPrice = (price) => {
  if (!price) return 'N/A';
  return new Intl.NumberFormat('fr-FR').format(price);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return date.toLocaleDateString('fr-FR');
};

// Calculer le prix le plus bas et le plus élevé pour les indicateurs
const priceStats = computed(() => {
  const prices = item.value?.data?.prices || [];
  if (prices.length === 0) return { min: 0, max: 0, avg: 0 };

  const validPrices = prices
      .map(p => p.sell_price_min)
      .filter(p => p && p > 0);

  if (validPrices.length === 0) return { min: 0, max: 0, avg: 0 };

  const min = Math.min(...validPrices);
  const max = Math.max(...validPrices);
  const avg = validPrices.reduce((a, b) => a + b, 0) / validPrices.length;

  return { min, max, avg };
});

// Calculer le pourcentage de différence par rapport au prix moyen
const getPriceVariance = (price) => {
  if (!price || priceStats.value.avg === 0) return 0;
  return ((price - priceStats.value.avg) / priceStats.value.avg) * 100;
};

// Obtenir la couleur en fonction de l'avantage du prix
const getPriceColor = (price) => {
  const variance = getPriceVariance(price);
  if (variance < -10) return 'text-green-400 bg-green-400/10'; // Très bon prix
  if (variance < -5) return 'text-green-300 bg-green-300/10';  // Bon prix
  if (variance > 10) return 'text-red-400 bg-red-400/10';      // Prix élevé
  if (variance > 5) return 'text-red-300 bg-red-300/10';       // Prix moyennement élevé
  return 'text-yellow-300 bg-yellow-300/10';                   // Prix moyen
};

// Obtenir l'indicateur de fraîcheur des données
const getDataFreshness = (dateString) => {
  if (!dateString) return { color: 'text-gray-500', label: 'Inconnue' };

  const date = new Date(dateString);
  const now = new Date();
  const diffHours = Math.abs(now - date) / (1000 * 60 * 60);

  if (diffHours < 6) return { color: 'text-green-400', label: 'Très récent' };
  if (diffHours < 24) return { color: 'text-yellow-400', label: 'Récent' };
  if (diffHours < 72) return { color: 'text-orange-400', label: 'Modéré' };
  return { color: 'text-red-400', label: 'Ancien' };
};

// Trier les prix par avantage (meilleurs prix en premier)
const sortedPrices = computed(() => {
  const prices = item.value?.data?.prices || [];
  return [...prices]
      .filter(p => p.sell_price_min && p.sell_price_min > 0)
      .sort((a, b) => a.sell_price_min - b.sell_price_min);
});
</script>

<template>
  <div v-if="item" class="space-y-6 border border-gray-600 rounded-lg">
    <!-- En-tête de l'item -->
    <div class="bg-gray-800/50 rounded-lg p-6">
      <div class="flex items-center space-x-4 mb-4">
        <!-- Image principale de l'item -->
        <img
            :src="`https://render.albiononline.com/v1/item/${item.data?.UniqueName || 'T1_BACKPACK'}`"
            :alt="`Image de ${item.data?.LocalizedNames?.['FR-FR'] || 'item'}`"
            class="w-24 h-24 rounded-lg p-2"
            @error="$event.target.src = 'https://render.albiononline.com/v1/item/T1_BACKPACK'"
        >
        <div>
          <h2 class="text-2xl font-bold text-white">
            {{ item.data?.LocalizedNames?.['FR-FR'] || item.data?.LocalizedNames?.['EN-US'] || 'Nom indisponible' }}
          </h2>
          <div class="text-sm text-gray-400 mt-1">{{ item.data?.UniqueName || 'ID indisponible' }}</div>
        </div>
      </div>
      <br>

      <!-- Statistiques globales -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4" v-if="priceStats.min > 0">
        <div class="bg-gray-700/50 rounded-lg p-4">
          <div class="text-sm text-gray-400">Prix minimum</div>
          <div class="text-xl font-bold text-green-400">{{ formatPrice(priceStats.min) }}</div>
        </div>
        <div class="bg-gray-700/50 rounded-lg p-4">
          <div class="text-sm text-gray-400">Prix moyen</div>
          <div class="text-xl font-bold text-yellow-400">{{ formatPrice(Math.round(priceStats.avg)) }}</div>
        </div>
        <div class="bg-gray-700/50 rounded-lg p-4">
          <div class="text-sm text-gray-400">Prix maximum</div>
          <div class="text-xl font-bold text-red-400">{{ formatPrice(priceStats.max) }}</div>
        </div>
      </div>
    </div>

    <!-- Cartes des prix par ville -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
          v-for="price in sortedPrices"
          :key="`${price.city}-${price.quality}`"
          class="bg-gray-800/70 rounded-lg transition-colors p-5"
      >
        <!-- En-tête de la carte -->
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center space-x-3">
            <!-- Image de l'item -->
            <div>
              <h3 class="text-lg font-semibold text-white">{{ price.city }}</h3>
            </div>
          </div>

          <!-- Indicateur de fraîcheur -->
          <div class="flex flex-col items-end">
            <div :class="getDataFreshness(price.sell_price_min_date).color + ' text-xs font-medium'">
              {{ getDataFreshness(price.sell_price_min_date).label }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              {{ formatDate(price.sell_price_min_date) }}
            </div>
          </div>
        </div>

        <!-- Prix principal -->
        <div class="mb-4">
          <div class="flex items-baseline space-x-2">
            <span :class="getPriceColor(price.sell_price_min).split(' ')[0] + ' text-2xl font-bold'">
              {{ formatPrice(price.sell_price_min) }}
            </span>
          </div>

          <!-- Indicateur de variance -->
          <div class="mt-2">
            <div
                :class="getPriceColor(price.sell_price_min) + ' px-2 py-1 rounded-md text-xs font-medium inline-block'"
            >
              {{ getPriceVariance(price.sell_price_min) > 0 ? '+' : '' }}{{ getPriceVariance(price.sell_price_min).toFixed(1) }}%
            </div>
          </div>
        </div>

        <!-- Informations détaillées -->
        <div class="space-y-2 text-sm">
<!--          <div class="flex justify-between" v-if="price.buy_price_max">-->
<!--            <span class="text-gray-400">Prix d'achat max:</span>-->
<!--            <span class="text-blue-400 font-medium">{{ formatPrice(price.buy_price_max) }}</span>-->
<!--          </div>-->

<!--          <div class="flex justify-between" v-if="price.sell_price_max">-->
<!--            <span class="text-gray-400">Prix de vente max:</span>-->
<!--            <span class="text-purple-400 font-medium">{{ formatPrice(price.sell_price_max) }}</span>-->
<!--          </div>-->

          <!-- Calcul de marge potentielle -->
<!--          <div-->
<!--              v-if="price.buy_price_max && price.sell_price_min && price.sell_price_min > price.buy_price_max"-->
<!--              class="flex justify-between pt-2 border-t border-gray-600"-->
<!--          >-->
<!--            <span class="text-gray-400">Marge potentielle:</span>-->
<!--            <span class="text-green-400 font-semibold">-->
<!--              {{ formatPrice(price.sell_price_min - price.buy_price_max) }}-->
<!--            </span>-->
<!--          </div>-->
        </div>

        <!-- Barre de progression visuelle du prix -->
<!--        <div class="mt-4" v-if="priceStats.max > priceStats.min">-->
<!--          <div class="w-full bg-gray-700 rounded-full h-2">-->
<!--            <div-->
<!--                class="h-2 rounded-full transition-all duration-300"-->
<!--                :class="getPriceColor(price.sell_price_min).split(' ')[0].replace('text-', 'bg-')"-->
<!--                :style="{ width: ((price.sell_price_min - priceStats.min) / (priceStats.max - priceStats.min)) * 100 + '%' }"-->
<!--            ></div>-->
<!--          </div>-->
<!--          <div class="flex justify-between text-xs text-gray-500 mt-1">-->
<!--            <span>{{ formatPrice(priceStats.min) }}</span>-->
<!--            <span>{{ formatPrice(priceStats.max) }}</span>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>

    <!-- Message si aucun prix -->
    <div v-if="sortedPrices.length === 0" class="text-center py-12">
      <div class="text-gray-400 text-lg">Aucune donnée de prix disponible</div>
      <div class="text-gray-500 text-sm mt-2">Les prix apparaîtront ici une fois les données synchronisées</div>
    </div>
  </div>

  <!-- Fallback si pas d'item -->
  <div v-else class="text-center py-12">
    <div class="text-gray-400 text-lg">Aucun élément à afficher</div>
  </div>
</template>

<style scoped>
/* Animations personnalisées */
.hover\:border-gray-600:hover {
  transition: border-color 0.2s ease-in-out;
}

/* Effet de survol pour les cartes */
.bg-gray-800\/70:hover {
  background-color: rgba(31, 41, 55, 0.8);
}
</style>