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

    <!-- Graphique des prix historiques -->
    <div class="bg-gray-800/50 rounded-lg p-6">
      <h3 class="text-xl font-bold text-white mb-4">Évolution des prix - Black Market</h3>

      <!-- Contrôles pour filtrer les qualités -->
      <div class="mb-4 flex flex-wrap gap-2">
        <button
            v-for="quality in availableQualities"
            :key="quality"
            @click="toggleQuality(quality)"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              selectedQualities.includes(quality)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            ]"
        >
          Qualité {{ quality }}
        </button>
      </div>

      <!-- Container du graphique -->
      <div class="relative h-96">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>

    <!-- Cartes des prix par ville (version simplifiée) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
          v-for="price in sortedPrices"
          :key="`${price.city}-${price.quality}`"
          class="bg-gray-800/70 rounded-lg transition-colors p-5"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center space-x-3">
            <div>
              <h3 class="text-lg font-semibold text-white">{{ price.city }}</h3>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <div :class="getDataFreshness(price.sell_price_min_date).color + ' text-xs font-medium'">
              {{ getDataFreshness(price.sell_price_min_date).label }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              {{ formatDate(price.sell_price_min_date) }}
            </div>
          </div>
        </div>

        <div class="mb-4">
          <div class="flex items-baseline space-x-2">
            <span :class="getPriceColor(price.sell_price_min).split(' ')[0] + ' text-2xl font-bold'">
              {{ formatPrice(price.sell_price_min) }}
            </span>
          </div>
          <div class="mt-2">
            <div
                :class="getPriceColor(price.sell_price_min) + ' px-2 py-1 rounded-md text-xs font-medium inline-block'"
            >
              {{ getPriceVariance(price.sell_price_min) > 0 ? '+' : '' }}{{ getPriceVariance(price.sell_price_min).toFixed(1) }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message si aucun prix -->
    <div v-if="sortedPrices.length === 0" class="text-center py-12">
      <div class="text-gray-400 text-lg">Aucune donnée de prix disponible</div>
      <div class="text-gray-500 text-sm mt-2">Les prix apparaîtront ici une fois les données synchronisées</div>
    </div>
  </div>

  <div v-else class="text-center py-12">
    <div class="text-gray-400 text-lg">Aucun élément à afficher</div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import Chart from 'chart.js/auto';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  chartData: {
    type: Array,
    default: () => []
  }
});

const chartCanvas = ref(null);
const chartInstance = ref(null);
const selectedQualities = ref([1, 2, 3, 4]);

const item = computed(() => props.item);

// Couleurs pour chaque qualité
const qualityColors = {
  1: '#ef4444', // rouge
  2: '#f97316', // orange
  3: '#eab308', // jaune
  4: '#22c55e'  // vert
};

// Qualités disponibles dans les données
const availableQualities = computed(() => {
  if (!props.chartData || props.chartData.length === 0) return [];
  return [...new Set(props.chartData.map(dataset => dataset.quality))].sort();
});

// Fonction pour basculer l'affichage d'une qualité
const toggleQuality = (quality) => {
  const index = selectedQualities.value.indexOf(quality);
  if (index > -1) {
    selectedQualities.value.splice(index, 1);
  } else {
    selectedQualities.value.push(quality);
  }
};

// Formatage des prix
const formatPrice = (price) => {
  if (!price) return 'N/A';
  return new Intl.NumberFormat('fr-FR').format(price);
};

// Formatage des dates
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

// Statistiques des prix
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

// Variance des prix
const getPriceVariance = (price) => {
  if (!price || priceStats.value.avg === 0) return 0;
  return ((price - priceStats.value.avg) / priceStats.value.avg) * 100;
};

// Couleur des prix
const getPriceColor = (price) => {
  const variance = getPriceVariance(price);
  if (variance < -10) return 'text-green-400 bg-green-400/10';
  if (variance < -5) return 'text-green-300 bg-green-300/10';
  if (variance > 10) return 'text-red-400 bg-red-400/10';
  if (variance > 5) return 'text-red-300 bg-red-300/10';
  return 'text-yellow-300 bg-yellow-300/10';
};

// Fraîcheur des données
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

// Prix triés
const sortedPrices = computed(() => {
  const prices = item.value?.data?.prices || [];
  return [...prices]
      .filter(p => p.sell_price_min && p.sell_price_min > 0)
      .sort((a, b) => a.sell_price_min - b.sell_price_min);
});

// Préparer les données pour le graphique
const prepareChartData = () => {
  if (!props.chartData || props.chartData.length === 0) {
    return { datasets: [] };
  }

  const datasets = props.chartData
      .filter(dataset => selectedQualities.value.includes(dataset.quality))
      .map(dataset => ({
        label: `Qualité ${dataset.quality}`,
        data: dataset.data.map(point => ({
          x: point.timestamp,
          y: point.avg_price
        })),
        borderColor: qualityColors[dataset.quality],
        backgroundColor: qualityColors[dataset.quality] + '20',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointRadius: 3,
        pointHoverRadius: 6
      }));

  return { datasets };
};

// Créer le graphique
const createChart = () => {
  if (!chartCanvas.value) return;

  const ctx = chartCanvas.value.getContext('2d');

  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: prepareChartData(),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          labels: {
            color: '#e5e7eb',
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(31, 41, 55, 0.9)',
          titleColor: '#f9fafb',
          bodyColor: '#e5e7eb',
          borderColor: '#6b7280',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${formatPrice(context.parsed.y)}`;
            },
            title: function(context) {
              const date = new Date(context[0].parsed.x);
              return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
            }
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            displayFormats: {
              day: 'DD/MM',
              hour: 'DD/MM HH:mm'
            }
          },
          grid: {
            color: '#374151'
          },
          ticks: {
            color: '#9ca3af',
            font: {
              size: 11
            }
          }
        },
        y: {
          beginAtZero: false,
          grid: {
            color: '#374151'
          },
          ticks: {
            color: '#9ca3af',
            font: {
              size: 11
            },
            callback: function(value) {
              return formatPrice(value);
            }
          }
        }
      }
    }
  });
};

// Mettre à jour le graphique
const updateChart = () => {
  if (chartInstance.value) {
    chartInstance.value.data = prepareChartData();
    chartInstance.value.update();
  }
};

// Watchers
watch(() => props.chartData, () => {
  nextTick(() => {
    if (chartInstance.value) {
      updateChart();
    } else {
      createChart();
    }
  });
}, { deep: true });

watch(selectedQualities, () => {
  updateChart();
}, { deep: true });

// Lifecycle
onMounted(() => {
  nextTick(() => {
    createChart();
  });
});

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
});
</script>

<style scoped>
.hover\:border-gray-600:hover {
  transition: border-color 0.2s ease-in-out;
}

.bg-gray-800\/70:hover {
  background-color: rgba(31, 41, 55, 0.8);
}
</style>