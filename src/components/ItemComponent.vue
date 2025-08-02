<script setup>
import { computed, ref } from "vue";
import { useRouter } from 'vue-router';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js';
import { Line, Bar } from 'vue-chartjs';

// Configuration Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Props du composant
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

// Variables réactives
const item = computed(() => props.item);
const activeChart = ref('prices'); // Onglet actif : 'prices' ou 'volume'

// === FONCTIONS UTILITAIRES ===

// Formate un prix avec séparateurs de milliers
function formatPrice(price) {
  if (!price) return 'N/A';
  return new Intl.NumberFormat('fr-FR').format(price);
}

// Formate une date relative (aujourd'hui, hier, etc.)
function formatDate(dateString) {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return date.toLocaleDateString('fr-FR');
}

// === CALCULS DE PRIX ===

// Statistiques des prix (min, max, moyenne)
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

// Calcule la différence en % par rapport au prix moyen
function getPriceVariance(price) {
  if (!price || priceStats.value.avg === 0) return 0;
  return ((price - priceStats.value.avg) / priceStats.value.avg) * 100;
}

// Retourne les classes CSS selon l'avantage du prix
function getPriceColor(price) {
  const variance = getPriceVariance(price);

  if (variance < -10) return 'text-emerald-600 bg-emerald-50 border-emerald-200'; // Très bon prix
  if (variance < -5) return 'text-green-600 bg-green-50 border-green-200';        // Bon prix
  if (variance > 10) return 'text-red-600 bg-red-50 border-red-200';             // Prix élevé
  if (variance > 5) return 'text-orange-600 bg-orange-50 border-orange-200';     // Prix moyen-élevé
  return 'text-blue-600 bg-blue-50 border-blue-200';                            // Prix normal
}

// Indicateur de fraîcheur des données
function getDataFreshness(dateString) {
  if (!dateString) return { color: 'text-gray-500 bg-gray-50', label: 'Inconnue' };

  const date = new Date(dateString);
  const now = new Date();
  const diffHours = Math.abs(now - date) / (1000 * 60 * 60);

  if (diffHours < 6) return { color: 'text-emerald-600 bg-emerald-50', label: '-6 Heures' };
  if (diffHours < 24) return { color: 'text-blue-600 bg-blue-50', label: '-24 Heures' };
  if (diffHours < 72) return { color: 'text-yellow-600 bg-yellow-50', label: '+24 Heures' };
  return { color: 'text-red-600 bg-red-50', label: 'Ancien' };
}

// Liste des prix triés par ordre croissant (meilleurs prix en premier)
const sortedPrices = computed(() => {
  const prices = item.value?.data?.prices || [];
  return [...prices]
      .filter(p => p.sell_price_min && p.sell_price_min > 0)
      .sort((a, b) => a.sell_price_min - b.sell_price_min);
});

// === CONFIGURATION DES GRAPHIQUES ===

// Couleurs pour chaque ville
const cityColors = {
  'Brecilien': { bg: 'rgba(34, 197, 94, 0.2)', border: 'rgb(34, 197, 94)' },
  'Bridgewatch': { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgb(59, 130, 246)' },
  'Fort Sterling': { bg: 'rgba(168, 85, 247, 0.2)', border: 'rgb(168, 85, 247)' },
  'Lymhurst': { bg: 'rgba(245, 158, 11, 0.2)', border: 'rgb(245, 158, 11)' },
  'Martlock': { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgb(239, 68, 68)' },
  'Thetford': { bg: 'rgba(14, 165, 233, 0.2)', border: 'rgb(14, 165, 233)' }
};

// Données pour le graphique des prix historiques
const priceChartData = computed(() => {
  const chartData = item.value?.data?.charts?.prices || [];
  if (chartData.length === 0) return null;

  // Récupère toutes les dates uniques
  const allDates = [...new Set(
      chartData.flatMap(city => city.data.map(d => d.timestamp))
  )].sort();

  // Crée un dataset pour chaque ville
  const datasets = chartData.map(cityData => {
    const color = cityColors[cityData.location] || {
      bg: 'rgba(107, 114, 128, 0.2)',
      border: 'rgb(107, 114, 128)'
    };

    return {
      label: cityData.location,
      data: allDates.map(date => {
        const dataPoint = cityData.data.find(d => d.timestamp === date);
        return dataPoint ? dataPoint.avg_price : null;
      }),
      borderColor: color.border,
      backgroundColor: color.bg,
      borderWidth: 2,
      fill: false,
      tension: 0.1,
      pointRadius: 3,
      pointHoverRadius: 5
    };
  });

  return {
    labels: allDates.map(date => new Date(date).toLocaleDateString('fr-FR', {
      month: 'short',
      day: 'numeric'
    })),
    datasets
  };
});

// Données pour le graphique des volumes
const volumeChartData = computed(() => {
  const chartData = item.value?.data?.charts?.prices || [];
  if (chartData.length === 0) return null;

  const allDates = [...new Set(
      chartData.flatMap(city => city.data.map(d => d.timestamp))
  )].sort();

  const datasets = chartData.map(cityData => {
    const color = cityColors[cityData.location] || {
      bg: 'rgba(107, 114, 128, 0.6)',
      border: 'rgb(107, 114, 128)'
    };

    return {
      label: cityData.location,
      data: allDates.map(date => {
        const dataPoint = cityData.data.find(d => d.timestamp === date);
        return dataPoint ? dataPoint.item_count : 0;
      }),
      backgroundColor: color.bg,
      borderColor: color.border,
      borderWidth: 1
    };
  });

  return {
    labels: allDates.map(date => new Date(date).toLocaleDateString('fr-FR', {
      month: 'short',
      day: 'numeric'
    })),
    datasets
  };
});

// Options communes pour les graphiques
const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    }
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Date'
      }
    }
  }
};

// Options spécifiques pour le graphique des prix
const priceChartOptions = {
  ...baseChartOptions,
  plugins: {
    ...baseChartOptions.plugins,
    title: {
      display: true,
      text: 'Évolution des prix par ville',
      font: { size: 16, weight: 'bold' }
    },
    tooltip: {
      ...baseChartOptions.plugins.tooltip,
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${formatPrice(context.raw)}`;
        }
      }
    }
  },
  scales: {
    ...baseChartOptions.scales,
    y: {
      display: true,
      title: {
        display: true,
        text: 'Prix'
      },
      ticks: {
        callback: function(value) {
          return formatPrice(value);
        }
      }
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  }
};

// Options spécifiques pour le graphique des volumes
const volumeChartOptions = {
  ...baseChartOptions,
  plugins: {
    ...baseChartOptions.plugins,
    title: {
      display: true,
      text: 'Volume des transactions par ville',
      font: { size: 16, weight: 'bold' }
    },
    tooltip: {
      ...baseChartOptions.plugins.tooltip,
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${new Intl.NumberFormat('fr-FR').format(context.raw)} items`;
        }
      }
    }
  },
  scales: {
    ...baseChartOptions.scales,
    y: {
      display: true,
      title: {
        display: true,
        text: 'Nombre d\'items'
      },
      stacked: true,
      ticks: {
        callback: function(value) {
          return new Intl.NumberFormat('fr-FR').format(value);
        }
      }
    }
  }
};
</script>

<template>
  <!-- Contenu principal -->
  <div v-if="item" class="rounded-2xl shadow-lg transition-all duration-300 overflow-hidden fade-in gradient-hover border border-black">
    <div class="relative p-6">

      <!-- En-tête avec image et nom de l'item -->
      <div class="flex items-center space-x-6 mb-6">
        <div class="relative">
          <img
              :src="`https://render.albiononline.com/v1/item/${item.data?.UniqueName || 'T1_BACKPACK'}`"
              :alt="`Image de ${item.data?.LocalizedNames?.['FR-FR'] || 'item'}`"
              class="w-20 h-20 p-2 cursor-pointer transition-all duration-300"
              @error="$event.target.src = 'https://render.albiononline.com/v1/item/T1_BACKPACK'"
          >
        </div>

        <div class="flex-1">
          <h2 class="text-2xl font-bold text-white mb-2">
            {{ item.data?.LocalizedNames?.['FR-FR'] || item.data?.LocalizedNames?.['EN-US'] || 'Nom indisponible' }}
          </h2>
          <div class="inline-flex items-center px-3 py-1 bg-white/20 glass-effect rounded-full text-sm font-medium">
            {{ item.data?.UniqueName || 'ID indisponible' }}
          </div>
        </div>
      </div>

      <!-- Liste des prix par ville -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
              v-for="price in sortedPrices"
              :key="`${price.city}-${price.quality}`"
              class="bg-gray-50 rounded-xl p-5 transition-all duration-200 border border-gray-100"
          >
            <!-- En-tête de la carte prix -->
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-bold text-gray-900 mb-1">
                  {{ price.city }}
                </h3>
                <div :class="['inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium', getDataFreshness(price.sell_price_min_date).color]">
                  {{ getDataFreshness(price.sell_price_min_date).label }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs text-gray-500">
                  {{ formatDate(price.sell_price_min_date) }}
                </div>
              </div>
            </div>

            <!-- Prix et indicateur de variance -->
            <div class="mb-4">
              <div class="text-3xl font-bold text-gray-900 mb-2 responsive-text">
                {{ formatPrice(price.sell_price_min) }}
              </div>

              <!-- Badge de variance avec icône -->
              <div :class="['inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold border', getPriceColor(price.sell_price_min)]">
                <!-- Icône flèche bas (bon prix) -->
                <svg
                    v-if="getPriceVariance(price.sell_price_min) < 0"
                    class="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                </svg>
                <!-- Icône flèche haut (prix élevé) -->
                <svg
                    v-else-if="getPriceVariance(price.sell_price_min) > 0"
                    class="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
                <!-- Icône ligne horizontale (prix neutre) -->
                <svg
                    v-else
                    class="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"></path>
                </svg>
                {{ getPriceVariance(price.sell_price_min) > 0 ? '+' : '' }}{{ getPriceVariance(price.sell_price_min).toFixed(1) }}%
              </div>
            </div>
          </div>
        </div>

        <!-- Message si aucun prix disponible -->
        <div v-if="sortedPrices.length === 0" class="text-center py-16">
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 003.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucune donnée de prix disponible</h3>
          <p class="text-gray-600">Les prix apparaîtront ici une fois les données synchronisées</p>
        </div>
      </div>

      <!-- Élément décoratif -->
      <div class="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div class="w-full h-full bg-white rounded-full transform translate-x-16 -translate-y-16"></div>
      </div>
    </div>

    <!-- Section des graphiques -->
    <div class="p-6" v-if="priceChartData || volumeChartData">
      <div class="bg-white rounded-xl p-6 mb-6">

        <!-- Sélecteur d'onglets pour les graphiques -->
        <div class="flex justify-center mb-6">
          <div class="bg-gray-100 rounded-lg p-1 flex">
            <button
                @click="activeChart = 'prices'"
                :class="[
                  'px-4 py-2 rounded-md font-medium transition-all duration-200',
                  activeChart === 'prices'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
            >
              Prix historiques
            </button>
            <button
                @click="activeChart = 'volume'"
                :class="[
                  'px-4 py-2 rounded-md font-medium transition-all duration-200',
                  activeChart === 'volume'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
            >
              Volume des transactions
            </button>
          </div>
        </div>

        <!-- Conteneur des graphiques -->
        <div class="h-96">
          <Line
              v-if="activeChart === 'prices' && priceChartData"
              :data="priceChartData"
              :options="priceChartOptions"
          />
          <Bar
              v-if="activeChart === 'volume' && volumeChartData"
              :data="volumeChartData"
              :options="volumeChartOptions"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Message d'erreur si pas d'item -->
  <div v-else class="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </div>
    <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucun élément à afficher</h3>
    <p class="text-gray-600">Veuillez vérifier les données ou réessayer</p>
  </div>
</template>

<style scoped>
/* Animation d'entrée */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fade-in-up 0.6s ease-out;
}

/* Effet de survol pour les cartes */
.card-hover:hover {
  transform: translateY(-2px);
}

/* Effet glassmorphism */
.glass-effect {
  backdrop-filter: blur(4px);
}

/* Image hover effect */
.image-hover:hover {
  transform: scale(1.1);
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  border-radius: 3px;
}

/* Design responsive */
@media (max-width: 768px) {
  .responsive-text {
    font-size: 1.5rem;
    line-height: 2rem;
  }
}
</style>