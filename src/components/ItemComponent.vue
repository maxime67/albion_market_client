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

  if (variance < -10) return 'text-emerald-700 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-emerald-100'; // Très bon prix
  if (variance < -5) return 'text-green-700 bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-green-100';        // Bon prix
  if (variance > 10) return 'text-red-700 bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-red-100';             // Prix élevé
  if (variance > 5) return 'text-orange-700 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-orange-100';     // Prix moyen-élevé
  return 'text-blue-700 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-blue-100';                            // Prix normal
}

// Indicateur de fraîcheur des données
function getDataFreshness(dateString) {
  if (!dateString) return { color: 'text-gray-600 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200', label: 'Inconnue' };

  const date = new Date(dateString);
  const now = new Date();
  const diffHours = Math.abs(now - date) / (1000 * 60 * 60);

  if (diffHours < 6) return { color: 'text-emerald-700 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200', label: '< 6h' };
  if (diffHours < 24) return { color: 'text-blue-700 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200', label: '< 24h' };
  if (diffHours < 72) return { color: 'text-yellow-700 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200', label: '> 24h' };
  return { color: 'text-red-700 bg-gradient-to-br from-red-50 to-red-100 border-red-200', label: 'Ancien' };
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

// Options pour le graphique des prix
const priceChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Évolution des prix par ville',
      font: {
        size: 16,
        weight: 'bold'
      }
    },
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
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Prix (silver)'
      },
      beginAtZero: true
    }
  },
  elements: {
    point: {
      radius: 3,
      hoverRadius: 5
    }
  }
}));

// Options pour le graphique des volumes
const volumeChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Volume des transactions par ville',
      font: {
        size: 16,
        weight: 'bold'
      }
    },
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
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Nombre d\'articles'
      },
      beginAtZero: true
    }
  }
}));

</script>

<template>
  <br>
  <div v-if="item" class="bg-white rounded-2xl shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:shadow-2xl transform hover:-translate-y-1">
    <div class="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 p-8 text-white">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 20% 50%, #ffffff 2px, transparent 2px), radial-gradient(circle at 80% 50%, #ffffff 2px, transparent 2px); background-size: 30px 30px;"></div>
      </div>
      <div class="relative z-10 flex items-center space-x-6">
        <div class="relative group">
          <div class="absolute -inset-1 bg-gradient-to-r from-blue-300 to-purple-300 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <div class="relative bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30">
            <img
                :src="`https://render.albiononline.com/v1/item/${item.data?.UniqueName || 'T1_BACKPACK'}`"
                :alt="`Image de ${item.data?.LocalizedNames?.['FR-FR'] || 'item'}`"
                class="w-16 h-16 cursor-pointer transition-all duration-300 hover:scale-110"
                @error="$event.target.src = 'https://render.albiononline.com/v1/item/T1_BACKPACK'"
            >
          </div>
        </div>

        <div class="flex-1">
          <h2 class="text-3xl font-bold mb-3 text-white drop-shadow-sm">
            {{ item.data?.LocalizedNames?.['FR-FR'] || item.data?.LocalizedNames?.['EN-US'] || 'Nom indisponible' }}
          </h2>
          <div class="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30 shadow-lg">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            {{ item.data?.UniqueName || 'ID indisponible' }}
          </div>
        </div>
      </div>
    </div>
    <div class="p-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
            v-for="(price, index) in sortedPrices"
            :key="`${price.city}-${price.quality}`"
            class="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 transition-all duration-300 border border-gray-200 hover:border-gray-300 hover:shadow-lg transform hover:-translate-y-1"
            :style="{ animationDelay: `${index * 100}ms` }"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                {{ price.city }}
              </h3>
              <div :class="['inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium shadow-sm', getDataFreshness(price.sell_price_min_date).color]">
                <div class="w-2 h-2 rounded-full mr-2 animate-pulse"
                     :class="getDataFreshness(price.sell_price_min_date).color.includes('emerald') ? 'bg-emerald-400' :
                            getDataFreshness(price.sell_price_min_date).color.includes('blue') ? 'bg-blue-400' :
                            getDataFreshness(price.sell_price_min_date).color.includes('yellow') ? 'bg-yellow-400' : 'bg-red-400'">
                </div>
                {{ getDataFreshness(price.sell_price_min_date).label }}
              </div>
            </div>
            <div class="text-right">
              <div class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                {{ formatDate(price.sell_price_min_date) }}
              </div>
            </div>
          </div>
          <div class="mb-4">
            <div class="text-3xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
              {{ formatPrice(price.sell_price_min) }}
              <span class="text-base text-gray-500 font-normal">silver</span>
            </div>
            <div :class="['inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold border-2 shadow-lg', getPriceColor(price.sell_price_min)]">
              <svg
                  v-if="getPriceVariance(price.sell_price_min) < -5"
                  class="w-4 h-4 mr-2 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
              </svg>
              <svg
                  v-else-if="getPriceVariance(price.sell_price_min) > 5"
                  class="w-4 h-4 mr-2 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              <svg
                  v-else
                  class="w-4 h-4 mr-2"
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
      <div v-if="sortedPrices.length === 0" class="text-center py-20">
        <div class="max-w-md mx-auto">
          <div class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 003.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Aucune donnée de prix disponible</h3>
          <p class="text-gray-600 leading-relaxed">Les prix apparaîtront ici une fois les données synchronisées avec l'API d'Albion Online</p>
        </div>
      </div>
    </div>
    <div class="bg-gray-50 border-t border-gray-200" v-if="priceChartData || volumeChartData">
      <div class="p-8">
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div class="flex justify-center mb-8">
            <div class="bg-gray-100 rounded-xl  flex shadow-inner">
              <button
                  @click="activeChart = 'prices'"
                  :class="[
                    'px-6 py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden',
                    activeChart === 'prices'
                      ? 'bg-white text-blue-600 shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  ]"
              >
                <span class="relative z-10 flex items-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                  <span>Prix historiques</span>
                </span>
              </button>
              <button
                  @click="activeChart = 'volume'"
                  :class="[
                    'px-6 py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden',
                    activeChart === 'volume'
                      ? 'bg-white text-blue-600 shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  ]"
              >
                <span class="relative z-10 flex items-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <span>Volume des transactions</span>
                </span>
              </button>
            </div>
          </div>
          <div class="h-96 relative">
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
  </div>
  <div v-else class="bg-white rounded-2xl shadow-xl p-20 text-center border border-gray-200">
    <div class="max-w-md mx-auto">
      <div class="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 mb-3">Aucun élément à afficher</h3>
      <p class="text-gray-600 leading-relaxed">Veuillez vérifier les données ou réessayer plus tard</p>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}


::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #7c3aed);
}

@media (max-width: 768px) {
  .responsive-text {
    font-size: 1.5rem;
    line-height: 2rem;
  }

  .grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:opacity-30 {
  opacity: 0.3;
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 0px, #e0e0e0 40px, #f0f0f0 80px);
  background-size: 200px;
  animation: shimmer 1.5s infinite;
}
</style>