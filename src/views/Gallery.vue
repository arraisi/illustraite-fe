<script setup>
import { onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import Toast from 'primevue/toast';
import { useGalleryStore } from '../stores/gallery';
import { useApi } from '../composables/useApi';
import { useImageDownload } from '../composables/useImageDownload';

const toast = useToast();
const gallery = useGalleryStore();
const api = useApi();
const { download } = useImageDownload();

async function loadImages() {
  try {
    await gallery.fetchImages(api);
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Failed to load gallery', detail: err.message, life: 4000 });
  }
}

onMounted(() => {
  if (!gallery.hasLoaded) {
    loadImages();
  }
});
</script>

<template>
  <Toast />
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gallery</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Browse your generated assets</p>
    </div>

    <!-- Loading skeletons -->
    <div v-if="!gallery.hasLoaded" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <Skeleton width="100%" height="200px" />
        <div class="mt-3 space-y-2 px-1">
          <Skeleton width="80%" height="14px" />
          <Skeleton width="50%" height="12px" />
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="gallery.images.length === 0" class="flex flex-col items-center justify-center py-20">
      <svg class="h-16 w-16 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
      </svg>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">No images yet. Generate your first asset in the Workspace.</p>
      <RouterLink to="/">
        <Button label="Go to Workspace" class="mt-4" />
      </RouterLink>
    </div>

    <!-- Image grid -->
    <template v-else>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="image in gallery.images"
          :key="image.id"
          class="group rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
        >
          <div class="relative overflow-hidden rounded-t-2xl">
            <img
              :src="image.image_url"
              :alt="image.user_prompt"
              class="h-52 w-full object-cover"
            />
            <div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
              <Button
                label="Download"
                severity="secondary"
                @click="download(image.image_url)"
                class="text-xs"
              />
            </div>
          </div>
          <div class="p-4">
            <p class="line-clamp-2 text-sm text-gray-700 dark:text-gray-300">{{ image.user_prompt }}</p>
            <p class="mt-1 text-xs text-gray-400">{{ new Date(image.created_at).toLocaleDateString() }}</p>
          </div>
        </div>
      </div>

      <div v-if="gallery.hasMore" class="flex justify-center pt-4">
        <Button label="Load More" severity="secondary" @click="loadImages" />
      </div>
    </template>
  </div>
</template>
