<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Passwords do not match', life: 4000 });
    return;
  }

  loading.value = true;
  try {
    await authStore.register(name.value, email.value, password.value);
    toast.add({ severity: 'success', summary: 'Account created', detail: 'You can now sign in', life: 3000 });
    router.push('/login');
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Registration failed', detail: err.message, life: 4000 });
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
          Illustr<span class="text-[#fe9a00]">AI</span>te
        </h1>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Create your account</p>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <div>
            <label for="name" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <InputText
              id="name"
              v-model="name"
              placeholder="Your name"
              required
            />
          </div>

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
              placeholder="Create a password"
              required
            />
          </div>

          <div>
            <label for="confirmPassword" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
            <InputText
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required
            />
          </div>

          <Button
            type="submit"
            label="Create Account"
            :loading="loading"
            class="w-full"
          />
        </form>

        <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?
          <RouterLink to="/login" class="font-medium text-[#fe9a00] hover:underline">Sign in</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
