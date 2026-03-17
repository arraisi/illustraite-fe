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
      throw new Error(err.error || 'Login failed');
    }

    const data = await res.json();
    const userData = data.user ?? data;
    setAuth(data.token, userData);
    creditBalance.value = userData.credit_balance ?? 0;
  }

  async function register(email, password) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Registration failed');
    }

    const data = await res.json();
    const userData = data.user ?? data;
    setAuth(data.token, userData);
    creditBalance.value = userData.credit_balance ?? 0;
  }

  async function fetchProfile() {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (!res.ok) {
      logout();
      return;
    }

    const data = await res.json();
    const userData = data.user ?? data;
    user.value = userData;
    creditBalance.value = userData.credit_balance ?? 0;
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

  async function restoreSession() {
    const stored = localStorage.getItem('token');
    if (!stored) return;

    token.value = stored;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${stored}` },
      });

      if (res.status === 401) {
        logout();
        return;
      }

      if (res.ok) {
        const data = await res.json();
        const userData = data.user ?? data;
        user.value = userData;
        creditBalance.value = userData.credit_balance ?? 0;
      }
    } catch {
      // Network error — keep the token, don't log out
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
