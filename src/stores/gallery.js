import { defineStore } from 'pinia';
import { ref } from 'vue';

const PAGE_SIZE = 9;

export const useGalleryStore = defineStore('gallery', () => {
  const images = ref([]);
  const hasLoaded = ref(false);
  const loading = ref(false);
  const page = ref(1);
  const hasMore = ref(true);

  async function fetchImages(apiInstance) {
    loading.value = true;
    try {
      const res = await apiInstance.get('/generations', {
        params: { page: page.value, limit: PAGE_SIZE, status: 'completed' },
      });

      const data = Array.isArray(res.data.data) ? res.data.data : [];
      images.value.push(...data);
      hasMore.value = !!res.data.has_next;
      hasLoaded.value = true;
      page.value++;
    } finally {
      loading.value = false;
    }
  }

  function addImage(image) {
    images.value.unshift(image);
  }

  function reset() {
    images.value = [];
    hasLoaded.value = false;
    page.value = 1;
    hasMore.value = true;
  }

  return {
    images,
    hasLoaded,
    loading,
    page,
    hasMore,
    fetchImages,
    addImage,
    reset,
  };
});
