<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <nav class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
      <RouterLink to="/" class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        Illustr<span class="text-[#fe9a00]">AI</span>te
      </RouterLink>

      <div class="flex items-center gap-6">
        <div class="flex items-center gap-1">
          <RouterLink
            to="/"
            class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            Workspace
          </RouterLink>
          <RouterLink
            to="/gallery"
            class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            Gallery
          </RouterLink>
          <RouterLink
            to="/billing"
            class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            Billing
          </RouterLink>
        </div>

        <div class="flex items-center gap-3">
          <span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            0 credits
          </span>

          <button class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" title="Toggle dark mode">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </button>

          <div class="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" title="User avatar" />

          <button class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
