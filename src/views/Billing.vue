<script setup>
import Button from 'primevue/button';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const packages = [
  { id: 'starter', name: 'Starter', credits: 10, price: '$5', description: 'Perfect for trying things out' },
  { id: 'pro', name: 'Pro', credits: 50, price: '$20', description: 'For regular creators', popular: true },
  { id: 'business', name: 'Business', credits: 200, price: '$60', description: 'Best value for teams' },
];
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Billing</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your credits and plan</p>
    </div>

    <!-- Credit Balance -->
    <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Current Balance</p>
          <p class="mt-1 text-4xl font-bold text-gray-900 dark:text-white">
            {{ authStore.creditBalance }}
            <span class="text-lg font-normal text-gray-400">credits</span>
          </p>
        </div>
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF5722]/10 dark:bg-[#FF5722]/20">
          <svg class="h-7 w-7 text-[#FF5722]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Pricing Packages -->
    <div>
      <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Top Up Credits</h2>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div
          v-for="pkg in packages"
          :key="pkg.id"
          class="relative rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md dark:bg-gray-950"
          :class="pkg.popular
            ? 'border-[#FF5722] ring-1 ring-[#FF5722]'
            : 'border-gray-200 dark:border-gray-800'"
        >
          <span
            v-if="pkg.popular"
            class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#FF5722] px-3 py-0.5 text-xs font-semibold text-white"
          >
            Popular
          </span>

          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ pkg.name }}</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ pkg.description }}</p>

          <div class="mt-4">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ pkg.price }}</span>
          </div>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ pkg.credits }} credits</p>

          <Button
            label="Coming Soon"
            severity="secondary"
            disabled
            class="mt-6 w-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>
