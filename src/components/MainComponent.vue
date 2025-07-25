<template>
  <div v-for="d in data" class="">
    {{ d }}
    <br>
    <br>
  </div>
</template>

<script>
import {onMounted, ref} from 'vue';
import testService from "@/services/testService.js";

export default {

  setup() {
    const data = ref([])
    const test = async() => {
      data.value = (await testService.test()).data
    }

    onMounted(() => {
      test();
    });

    return {
      data,
    };
  }
};
</script>

<style scoped>

</style>