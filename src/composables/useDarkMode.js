import { ref, watchEffect } from 'vue';

const isDark = ref(
  localStorage.getItem('theme')
    ? localStorage.getItem('theme') === 'dark'
    : false,
);

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDark.value);
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
});

export function useDarkMode() {
  return {
    isDark,
    toggle() {
      isDark.value = !isDark.value;
    },
  };
}
