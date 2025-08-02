<template>
  <nav :class="[
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
    isScrolled
      ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50'
      : 'bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50'
  ]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">

        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="flex items-center space-x-3 group">
            <div :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 transform group-hover:scale-110',
              isScrolled
                ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg'
            ]">
              A
            </div>
            <span :class="[
              'font-bold text-lg transition-colors duration-300 group-hover:text-blue-600',
              isScrolled ? 'text-gray-900' : 'text-white'
            ]">
              Albion Market
            </span>
          </router-link>
        </div>

        <!-- Navigation Items - Desktop -->
        <div class="hidden md:flex items-center space-x-1">
          <router-link
              v-for="item in navigationItems"
              :key="item.path"
              :to="item.path"
              :class="[
              'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
              getItemClasses(item.path)
            ]"
          >
            <span class="relative z-10">{{ item.name }}</span>

            <!-- Active indicator -->
            <div v-if="isActiveRoute(item.path)"
                 class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg shadow-blue-500/25"></div>
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
              @click="toggleMobileMenu"
              :class="[
              'p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500',
              isScrolled
                ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                : 'text-white hover:bg-white/10'
            ]"
          >
            <svg
                class="w-6 h-6 transition-transform duration-300"
                :class="{ 'rotate-90': isMobileMenuOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path
                  v-if="!isMobileMenuOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div :class="[
        'md:hidden transition-all duration-300 overflow-hidden',
        isMobileMenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
      ]">
        <div :class="[
          'pt-4 space-y-2 border-t',
          isScrolled ? 'border-gray-200' : 'border-slate-600'
        ]">
          <router-link
              v-for="item in navigationItems"
              :key="item.path"
              :to="item.path"
              @click="closeMobileMenu"
              :class="[
              'block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 transform hover:scale-105',
              getMobileItemClasses(item.path)
            ]"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const navigationItems = [
  { name: 'Ores', path: '/ore' },
  { name: 'Metal Bar', path: '/metalBar' },
  { name: 'Wood', path: '/wood' },
  { name: 'Planks', path: '/planks' },
  { name: 'Cotton', path: '/fiber' },
  { name: 'Cloth', path: '/cloth' },
  { name: 'Hide', path: '/hide' },
  { name: 'Leather', path: '/leather' },
  { name: 'Stone', path: '/rock' },
  { name: 'Stone Block', path: '/stoneblock' }
]

const isActiveRoute = (path) => {
  return route.path === path
}

const getItemClasses = (path) => {
  const isActive = isActiveRoute(path)
  const baseClasses = isScrolled.value
      ? 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
      : 'text-slate-300 hover:text-white hover:bg-white/10'

  if (isActive) {
    return 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
  }

  return baseClasses
}

const getMobileItemClasses = (path) => {
  const isActive = isActiveRoute(path)
  const baseClasses = isScrolled.value
      ? 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
      : 'text-slate-300 hover:text-white hover:bg-white/10'

  if (isActive) {
    return 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg'
  }

  return baseClasses
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Animation pour les éléments de navigation */
.router-link-exact-active {
  position: relative;
}

/* Effet de survol avancé */
nav a {
  position: relative;
  overflow: hidden;
}

nav a::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

nav a:hover::before {
  left: 100%;
}

/* Animation pour le menu mobile */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-menu-enter-active {
  animation: slideDown 0.3s ease-out;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .navigation-item {
    padding: 0.75rem 1rem;
    margin: 0.25rem 0;
  }
}

/* Focus states pour l'accessibilité */
nav a:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>