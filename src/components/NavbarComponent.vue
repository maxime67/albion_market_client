<template>
  <nav class="w-full bg-slate-800 shadow-lg border-b border-slate-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-center py-4">
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-8">
          <!-- Colonne 1: Ores / Metal Bar -->
          <div class="flex flex-col items-center gap-3">
            <router-link
                to="/ore"
                class="relative px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg transition-all duration-300 ease-in-out hover:text-white hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                active-class="text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
            >
              <span class="relative z-10">Ores</span>
            </router-link>

            <router-link
                to="/metalBar"
                class="relative px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg transition-all duration-300 ease-in-out hover:text-white hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                active-class="text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
            >
              <span class="relative z-10">Metal Bar</span>
            </router-link>
          </div>

          <!-- Colonne 2: Wood / Planks -->
          <div class="flex flex-col items-center gap-3">
            <router-link
                to="/wood"
                class="relative px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg transition-all duration-300 ease-in-out hover:text-white hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                active-class="text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
            >
              <span class="relative z-10">Wood</span>
            </router-link>

            <router-link
                to="/planks"
                class="relative px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg transition-all duration-300 ease-in-out hover:text-white hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                active-class="text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
            >
              <span class="relative z-10">Planks</span>
            </router-link>

          </div>

          <!-- Colonne 3: Cotton / Stone Block -->
          <div class="flex flex-col items-center gap-3">
            <router-link
                to="/fiber"
                class="relative px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg transition-all duration-300 ease-in-out hover:text-white hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                active-class="text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
            >
              <span class="relative z-10">Cotton</span>
            </router-link>

            <router-link
                to="/cloth"
                class="relative px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg transition-all duration-300 ease-in-out hover:text-white hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                active-class="text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
            >
              <span class="relative z-10">Cloth</span>
            </router-link>
          </div>

          <!-- Colonne 4: Hide / Planks -->
          <div class="flex flex-col items-center gap-3">
            <router-link
                to="/hide"
                class="relative px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg transition-all duration-300 ease-in-out hover:text-white hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                active-class="text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
            >
              <span class="relative z-10">Hide</span>
            </router-link>

            <router-link
                to="/leather"
                class="relative px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg transition-all duration-300 ease-in-out hover:text-white hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                active-class="text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
            >
              <span class="relative z-10">Leather</span>
            </router-link>
          </div>

          <div class="flex flex-col items-center gap-3">
            <router-link
                to="/rock"
                class="relative px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg transition-all duration-300 ease-in-out hover:text-white hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                active-class="text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
            >
              <span class="relative z-10">Stone</span>
            </router-link>

            <router-link
                to="/stoneblock"
                class="relative px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg transition-all duration-300 ease-in-out hover:text-white hover:bg-slate-600 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                active-class="text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
            >
              <span class="relative z-10">StoneBlock</span>
            </router-link>
          </div>
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