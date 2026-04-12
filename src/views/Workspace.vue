<script setup>
import { ref, watch, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import ColorPickerPopup from '../components/ui/ColorPickerPopup.vue';
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import Toast from 'primevue/toast';
import { useGeneratorStore } from '../stores/generator';
import { useAuthStore } from '../stores/auth';
import { useGalleryStore } from '../stores/gallery';
import { useApi } from '../composables/useApi';
import { useGenerationSocket } from '../composables/useGenerationSocket';
import { useImageDownload } from '../composables/useImageDownload';

const toast = useToast();
const generator = useGeneratorStore();
const authStore = useAuthStore();
const galleryStore = useGalleryStore();
const api = useApi();
const { download } = useImageDownload();

const styleOptions = ref([]);

const angleOptions = [
  { label: 'Front', value: 'front' },
  { label: 'Isometric', value: 'isometric' },
  { label: 'Top-down', value: 'top-down' },
  { label: 'Side', value: 'side' },
  { label: '3/4 View', value: 'three-quarter' },
];

onMounted(async () => {
  try {
    const res = await api.get('/presets');
    const presets = Array.isArray(res.data) ? res.data : (res.data.styles ?? []);
    styleOptions.value = presets.map((s) => ({
      label: s.name,
      value: s.id,
    }));
  } catch {
    toast.add({ severity: 'error', summary: 'Failed to load presets', detail: 'Could not fetch style options from server', life: 4000 });
  }
});

const showAdvanced = ref(false);
const primaryColor = ref(null);
const secondaryColor = ref(null);
let socketCleanup = null;

watch(primaryColor, (v) => {
  if (v) generator.setPrimaryColor(`#${v}`);
});

watch(secondaryColor, (v) => {
  if (v) generator.setSecondaryColor(`#${v}`);
});

async function generate() {
  if (!generator.prompt.trim()) {
    toast.add({ severity: 'warn', summary: 'Missing prompt', detail: 'Please enter a description', life: 3000 });
    return;
  }

  generator.startGeneration();

  try {
    const body = {
      prompt: generator.prompt,
      style_id: generator.stylePreset,
      camera_angle: generator.cameraAngle,
    };

    if (generator.colors.primary || generator.colors.secondary) {
      body.colors = {};
      if (generator.colors.primary) body.colors.primary = generator.colors.primary;
      if (generator.colors.secondary) body.colors.secondary = generator.colors.secondary;
    }

    const res = await api.post('/generate', body);

    const { generation_id } = res.data;

    const { status, imageUrl, error, close } = useGenerationSocket(generation_id);
    socketCleanup = close;

    watch(status, (val) => {
      if (val === 'completed' && imageUrl.value) {
        generator.completeGeneration(imageUrl.value);
        authStore.deductCredit();
        galleryStore.addImage({
          id: generation_id,
          image_url: imageUrl.value,
          user_prompt: generator.prompt,
          created_at: new Date().toISOString(),
        });
        socketCleanup = null;
      } else if (val === 'failed') {
        generator.resetGeneration();
        toast.add({ severity: 'error', summary: 'Generation failed', detail: error.value, life: 5000 });
        socketCleanup = null;
      }
    });
  } catch (err) {
    generator.resetGeneration();
    toast.add({ severity: 'error', summary: 'Request failed', detail: err.response?.data?.error || err.message, life: 5000 });
  }
}
</script>

<template>
  <Toast />
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Workspace</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Generate visually consistent 3D minimalist assets</p>
    </div>

    <div class="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <!-- Left: Controls -->
      <div class="space-y-6">
        <!-- Style Configurator -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Style Configuration</h2>

          <div class="space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Style Preset</label>
              <Select
                :modelValue="generator.stylePreset"
                @update:modelValue="generator.setStylePreset"
                :options="styleOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select a style"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Camera Angle</label>
              <Select
                :modelValue="generator.cameraAngle"
                @update:modelValue="generator.setCameraAngle"
                :options="angleOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select an angle"
              />
            </div>

            <!-- Advanced Toggle -->
            <div>
              <button
                @click="showAdvanced = !showAdvanced"
                :aria-expanded="showAdvanced"
                class="flex w-full items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <svg
                  class="h-4 w-4 transition-transform duration-200"
                  :class="{ 'rotate-90': showAdvanced }"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                Advanced
              </button>

              <div
                class="grid transition-all duration-300 ease-in-out"
                :class="showAdvanced ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'"
              >
                <div class="overflow-hidden">
                  <div class="space-y-3">
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Brand Colors</label>
                    <!-- Primary Color -->
                    <div>
                      <span class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Primary</span>
                      <div class="flex items-center gap-3">
                        <ColorPickerPopup v-model="primaryColor" />
                        <span v-if="generator.colors.primary" class="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                          <span class="h-3 w-3 rounded-full" :style="{ backgroundColor: generator.colors.primary }" />
                          {{ generator.colors.primary }}
                          <button @click="generator.clearColor('primary')" class="ml-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">&times;</button>
                        </span>
                      </div>
                    </div>
                    <!-- Secondary Color -->
                    <div>
                      <span class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Secondary</span>
                      <div class="flex items-center gap-3">
                        <ColorPickerPopup v-model="secondaryColor" />
                        <span v-if="generator.colors.secondary" class="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                          <span class="h-3 w-3 rounded-full" :style="{ backgroundColor: generator.colors.secondary }" />
                          {{ generator.colors.secondary }}
                          <button @click="generator.clearColor('secondary')" class="ml-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">&times;</button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Prompt Input -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Prompt</h2>
          <Textarea
            :modelValue="generator.prompt"
            @update:modelValue="generator.setPrompt"
            placeholder="Describe the asset you want to generate..."
            rows="4"
            autoResize
          />
          <Button
            label="Generate"
            :loading="generator.isGenerating"
            @click="generate"
            class="mt-4 w-full"
          />
        </div>
      </div>

      <!-- Right: Result Viewer -->
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Result</h2>

        <div v-if="generator.isGenerating" class="space-y-4">
          <Skeleton width="100%" height="320px" />
          <p class="text-center text-sm text-gray-400">Generating your asset...</p>
        </div>

        <div v-else-if="generator.generatedImageUrl" class="space-y-4">
          <div class="overflow-hidden rounded-xl shadow-sm">
            <img
              :src="generator.generatedImageUrl"
              alt="Generated asset"
              class="h-auto w-full object-contain"
            />
          </div>
          <Button
            label="Download"
            severity="secondary"
            @click="download(generator.generatedImageUrl)"
            class="w-full"
          />
        </div>

        <div v-else class="flex h-80 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            <p class="mt-2 text-sm text-gray-400">Your generated asset will appear here</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
