import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import App from './App.vue';
import router from './router';
import IllustraitePreset from './presets/illustraite';
import './assets/main.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(PrimeVue, { unstyled: true, pt: IllustraitePreset });
app.use(ToastService);

import { useAuthStore } from './stores/auth';
const authStore = useAuthStore();

Promise.resolve(authStore.restoreSession())
  .catch(() => {})
  .finally(() => app.mount('#app'));
