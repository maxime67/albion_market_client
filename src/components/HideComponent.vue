<template>
  <div class="p-4">
    <div v-if="data" class="bg-gray-800 rounded-lg p-6">
      <div v-for="item in data" :key="item.id" class="p-3">
        <item-component :item="item"></item-component>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import itemService from "@/services/itemService.js";
import ItemComponent from "@/components/ItemComponent.vue";

export default {
  components: {ItemComponent},
  setup() {
    const data = ref([]);

    const test = async () => {
      data.value = (await itemService.getHide());
    };

    const formatPrice = (price) => {
      if (!price || price === 0) return 'N/A';
      return price
    };

    const formatDate = (dateString) => {
      if (!dateString || dateString === '0001-01-01T00:00:00') return 'N/A';
      return new Date(dateString).toLocaleDateString('fr-FR');
    };

    onMounted(() => {
      test();
    });

    return {
      data,
      formatPrice,
      formatDate
    };
  }
};
</script>

<style scoped>
</style>