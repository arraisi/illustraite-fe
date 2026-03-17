import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import App from './App.vue';
import router from './router';
import IllustraitePreset from './presets/illustraite';
import './assets/main.css';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, { unstyled: true, pt: IllustraitePreset });
app.use(ToastService);
app.mount('#app');
