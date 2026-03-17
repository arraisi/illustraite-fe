import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGeneratorStore = defineStore('generator', () => {
  const stylePreset = ref(null);
  const colors = ref({ primary: null, secondary: null });
  const cameraAngle = ref('front');
  const prompt = ref('');
  const isGenerating = ref(false);
  const generatedImageUrl = ref(null);

  function setStylePreset(value) {
    stylePreset.value = value;
  }

  function setPrimaryColor(color) {
    colors.value = { ...colors.value, primary: color };
  }

  function setSecondaryColor(color) {
    colors.value = { ...colors.value, secondary: color };
  }

  function clearColor(key) {
    colors.value = { ...colors.value, [key]: null };
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
    setPrimaryColor,
    setSecondaryColor,
    clearColor,
    setCameraAngle,
    setPrompt,
    startGeneration,
    completeGeneration,
    resetGeneration,
  };
});
