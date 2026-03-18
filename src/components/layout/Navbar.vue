<script setup>
import { ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useDarkMode } from '../../composables/useDarkMode';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { isDark, toggle } = useDarkMode();
const mobileMenuOpen = ref(false);

const navLinks = [
  { to: '/', label: 'Workspace' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/billing', label: 'Billing' },
];

function isActive(path) {
  return route.path === path;
}

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <nav class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
      <RouterLink to="/" class="flex items-center">
        <img src="/icon/wordmarkicon.svg" alt="IllustrAIte" class="h-8" />
      </RouterLink>

      <!-- Mobile hamburger -->
      <button
        class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 md:hidden dark:text-gray-400 dark:hover:bg-gray-800"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Desktop nav -->
      <div class="hidden items-center gap-6 md:flex">
        <div class="flex items-center gap-1">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="isActive(link.to)
              ? 'bg-[#FF5722]/10 text-[#FF5722] dark:bg-[#FF5722]/20 dark:text-[#FF8A65]'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'"
            class="rounded-lg px-3 py-2 text-sm font-medium transition"
          >
            {{ link.label }}
          </RouterLink>
        </div>

        <div class="flex items-center gap-3">
          <span class="rounded-full bg-[#FF5722]/10 px-3 py-1 text-xs font-semibold text-[#FF5722] dark:bg-[#FF5722]/20 dark:text-[#FF8A65]">
            {{ authStore.creditBalance }} credits
          </span>

          <button
            class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            title="Toggle dark mode"
            @click="toggle"
          >
            <!-- Sun icon (shown in dark mode) -->
            <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
            </svg>
            <!-- Moon icon (shown in light mode) -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </button>

          <div
            class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            title="User avatar"
          >
            {{ authStore.user?.name?.charAt(0)?.toUpperCase() ?? '?' }}
          </div>

          <button
            class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            @click="handleLogout"
          >
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile dropdown -->
    <div v-if="mobileMenuOpen" class="border-t border-gray-200 px-6 pb-4 pt-2 md:hidden dark:border-gray-800">
      <div class="flex flex-col gap-1">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :class="isActive(link.to)
            ? 'bg-[#FF5722]/10 text-[#FF5722] dark:bg-[#FF5722]/20 dark:text-[#FF8A65]'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'"
          class="rounded-lg px-3 py-2 text-sm font-medium transition"
          @click="mobileMenuOpen = false"
        >
          {{ link.label }}
        </RouterLink>
      </div>

      <div class="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-800">
        <span class="rounded-full bg-[#FF5722]/10 px-3 py-1 text-xs font-semibold text-[#FF5722] dark:bg-[#FF5722]/20 dark:text-[#FF8A65]">
          {{ authStore.creditBalance }} credits
        </span>

        <div class="flex items-center gap-2">
          <button
            class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            @click="toggle"
          >
            <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </button>

          <button
            class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            @click="handleLogout"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
