<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);

async function handleLogin() {
  loading.value = true;
  try {
    await authStore.login(email.value, password.value);
    const redirect = route.query.redirect || '/';
    router.push(redirect);
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Login failed', detail: err.message, life: 4000 });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
    <Toast />
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Illustr<span class="text-[#FF5722]">AI</span>te
        </h1>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Sign in to your account</p>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label for="email" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <InputText
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label for="password" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <InputText
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <Button
            type="submit"
            label="Sign In"
            :loading="loading"
            class="w-full"
          />
        </form>

        <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?
          <RouterLink to="/register" class="font-medium text-[#FF5722] hover:underline">Create one</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
