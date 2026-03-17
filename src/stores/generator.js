import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGeneratorStore = defineStore('generator', () => {
  const stylePreset = ref('minimalist-3d');
  const colors = ref([]);
  const cameraAngle = ref('front');
  const prompt = ref('');
  const isGenerating = ref(false);
  const generatedImageUrl = ref(null);

  function setStylePreset(value) {
    stylePreset.value = value;
  }

  function addColor(color) {
    if (!colors.value.includes(color)) {
      colors.value.push(color);
    }
  }

  function removeColor(color) {
    colors.value = colors.value.filter((c) => c !== color);
  }

  function setCameraAngle(value) {
    cameraAngle.value = value;
  }

  function setPrompt(value) {
    prompt.value = value;
  }

  function startGeneration() {
    isGenerating.value = true;
    generatedImageUrl.value = null;
  }

  function completeGeneration(imageUrl) {
    isGenerating.value = false;
    generatedImageUrl.value = imageUrl;
  }

  function resetGeneration() {
    isGenerating.value = false;
    generatedImageUrl.value = null;
  }

  return {
    stylePreset,
    colors,
    cameraAngle,
    prompt,
    isGenerating,
    generatedImageUrl,
    setStylePreset,
    addColor,
    removeColor,
    setCameraAngle,
    setPrompt,
    startGeneration,
    completeGeneration,
    resetGeneration,
  };
});
