<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-6 dark:bg-gray-950">
    <div class="text-center">
      <p class="text-7xl font-bold text-[#fe9a00]">404</p>
      <h1 class="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Page not found</h1>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <RouterLink
        to="/"
        class="mt-6 inline-block rounded-xl bg-[#fe9a00] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e08800]"
      >
        Back to Home
      </RouterLink>
    </div>
  </div>
</template>
