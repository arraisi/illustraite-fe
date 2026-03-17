import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGalleryStore = defineStore('gallery', () => {
  const images = ref([]);
  const hasLoaded = ref(false);
  const page = ref(1);
  const hasMore = ref(true);

  async function fetchImages(apiInstance) {
    const res = await apiInstance.get('/gallery', {
      params: { page: page.value },
    });

    const data = res.data;
    images.value.push(...data.images);
    hasMore.value = data.has_more ?? false;
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
