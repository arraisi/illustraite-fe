import { defineStore } from 'pinia';
import { ref } from 'vue';

const PAGE_SIZE = 20;

export const useGalleryStore = defineStore('gallery', () => {
  const images = ref([]);
  const hasLoaded = ref(false);
  const page = ref(1);
  const hasMore = ref(true);

  async function fetchImages(apiInstance) {
    const res = await apiInstance.get('/generations', {
      params: { page: page.value, limit: PAGE_SIZE },
    });

    const data = Array.isArray(res.data) ? res.data : [];
    images.value.push(...data);
    hasMore.value = data.length >= PAGE_SIZE;
    hasLoaded.value = true;
    page.value++;
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
    page,
    hasMore,
    fetchImages,
    addImage,
    reset,
  };
});
