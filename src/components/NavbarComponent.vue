<template>
<!--  TODO: -->
<!--  Afficher les liens de manière verticla, ores au dessus de metalBar, Hide au dessus de Cloths etc-->
  <nav class="w-full bg-slate-800 shadow-lg border-b border-slate-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-center py-4">
        <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <router-link
              to="/ore"
              class="relative px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg transition-all duration-300 ease-in-out hover:text-white hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              active-class="text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
          >
            <span class="relative z-10">Ores</span>
          </router-link>

          <router-link
              to="/wood"
              class="relative px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg transition-all duration-300 ease-in-out hover:text-white hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              active-class="text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
          >
            <span class="relative z-10">Wood</span>
          </router-link>

          <router-link
              to="/cotton"
              class="relative px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg transition-all duration-300 ease-in-out hover:text-white hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              active-class="text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
          >
            <span class="relative z-10">Cotton</span>
          </router-link>

          <router-link
              to="/hide"
              class="relative px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg transition-all duration-300 ease-in-out hover:text-white hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              active-class="text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
          >
            <span class="relative z-10">Hide</span>
          </router-link>

          <router-link
              to="/metalBar"
              class="relative px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg transition-all duration-300 ease-in-out hover:text-white hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              active-class="text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
          >
            <span class="relative z-10">Metal Bar</span>
          </router-link>

          <router-link
              to="/cloth"
              class="relative px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg transition-all duration-300 ease-in-out hover:text-white hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              active-class="text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
          >
            <span class="relative z-10">Cloth</span>
          </router-link>

          <router-link
              to="/stoneBlock"
              class="relative px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg transition-all duration-300 ease-in-out hover:text-white hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              active-class="text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
          >
            <span class="relative z-10">Stone Block</span>
          </router-link>

          <router-link
              to="/planks"
              class="relative px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg transition-all duration-300 ease-in-out hover:text-white hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              active-class="text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
          >
            <span class="relative z-10">Planks</span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>