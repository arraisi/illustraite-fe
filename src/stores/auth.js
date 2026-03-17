import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null);
  const user = ref(null);
  const creditBalance = ref(0);

  const isAuthenticated = computed(() => !!token.value);

  function setAuth(authToken, userData) {
    token.value = authToken;
    user.value = userData;
    localStorage.setItem('token', authToken);
  }

  async function login(email, password) {
    // TODO: replace with real API call
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Login failed');
    }

    const data = await res.json();
    setAuth(data.token, data.user);
    creditBalance.value = data.user.credits ?? 0;
  }

  async function register(name, email, password) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Registration failed');
    }

    return res.json();
  }

  async function fetchProfile() {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (!res.ok) {
      logout();
      return;
    }

    const data = await res.json();
    user.value = data.user;
    creditBalance.value = data.user.credits ?? 0;
  }

  function deductCredit() {
    if (creditBalance.value > 0) {
      creditBalance.value--;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    creditBalance.value = 0;
    localStorage.removeItem('token');
  }

  function restoreSession() {
    const stored = localStorage.getItem('token');
    if (stored) {
      token.value = stored;
      return fetchProfile();
    }
  }

  return {
    token,
    user,
    creditBalance,
    isAuthenticated,
    login,
    register,
    fetchProfile,
    deductCredit,
    logout,
    restoreSession,
  };
});
