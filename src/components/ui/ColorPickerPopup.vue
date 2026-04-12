<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { onClickOutside } from '@vueuse/core';

const model = defineModel({ type: String, default: 'FF5722' });

const props = defineProps({
  presets: {
    type: Array,
    default: () => [
      'FF5722', 'e74c3c', 'e91e63', '9b59b6',
      '3498db', '00ADB5', '1abc9c', '2ecc71',
      'FF8A65', '303841', '95a5a6', '000000',
    ],
  },
});

const open = ref(false);
const triggerRef = ref(null);
const popupRef = ref(null);
const satCanvasRef = ref(null);
const hueCanvasRef = ref(null);

// Popup position (fixed, relative to trigger)
const popupStyle = ref({});

// Internal HSV state
const hue = ref(0);
const sat = ref(1);
const val = ref(1);

// Prevent circular updates
let internalUpdate = false;

const SAT_SIZE = 192;
const HUE_WIDTH = 192;
const HUE_HEIGHT = 14;

// --- Color conversion utilities ---
function hsvToRgb(h, s, v) {
  let r, g, b;
  const i = Math.floor(h / 60) % 6;
  const f = h / 60 - Math.floor(h / 60);
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      case b: h = ((r - g) / d + 4) * 60; break;
    }
  }
  return [h, s, v];
}

function hexToRgb(hex) {
  const n = parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r, g, b) {
  return [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

// --- Computed RGB from HSV ---
const rgb = computed(() => hsvToRgb(hue.value, sat.value, val.value));
const hexValue = computed(() => rgbToHex(rgb.value[0], rgb.value[1], rgb.value[2]));

// --- Hex input ---
const hexInput = ref('');

// --- RGB inputs ---
const rInput = ref(0);
const gInput = ref(0);
const bInput = ref(0);

// Sync inputs from HSV
function syncInputsFromHsv() {
  const [r, g, b] = hsvToRgb(hue.value, sat.value, val.value);
  hexInput.value = rgbToHex(r, g, b);
  rInput.value = r;
  gInput.value = g;
  bInput.value = b;
}

// Emit model value from HSV
function emitFromHsv() {
  internalUpdate = true;
  syncInputsFromHsv();
  model.value = hexValue.value;
  nextTick(() => { internalUpdate = false; });
}

// Watch model value changes from parent
watch(model, (newVal) => {
  if (internalUpdate) return;
  if (newVal && /^[0-9a-fA-F]{6}$/.test(newVal)) {
    const [r, g, b] = hexToRgb(newVal);
    const [h, s, v] = rgbToHsv(r, g, b);
    hue.value = h;
    sat.value = s;
    val.value = v;
    syncInputsFromHsv();
    drawSatCanvas();
  }
}, { immediate: true });

// --- Canvas drawing ---
function drawSatCanvas() {
  const canvas = satCanvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = SAT_SIZE;
  const h = SAT_SIZE;

  // Base hue color
  const [hr, hg, hb] = hsvToRgb(hue.value, 1, 1);

  // White to hue gradient (horizontal)
  const gradH = ctx.createLinearGradient(0, 0, w, 0);
  gradH.addColorStop(0, 'white');
  gradH.addColorStop(1, `rgb(${hr},${hg},${hb})`);
  ctx.fillStyle = gradH;
  ctx.fillRect(0, 0, w, h);

  // Transparent to black gradient (vertical)
  const gradV = ctx.createLinearGradient(0, 0, 0, h);
  gradV.addColorStop(0, 'rgba(0,0,0,0)');
  gradV.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.fillStyle = gradV;
  ctx.fillRect(0, 0, w, h);
}

function drawHueCanvas() {
  const canvas = hueCanvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, HUE_WIDTH, 0);
  for (let i = 0; i <= 6; i++) {
    const [r, g, b] = hsvToRgb(i * 60, 1, 1);
    grad.addColorStop(i / 6, `rgb(${r},${g},${b})`);
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, HUE_WIDTH, HUE_HEIGHT);
}

// --- Pointer handling for saturation canvas ---
let satDragging = false;

function handleSatPointer(e) {
  const canvas = satCanvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const x = Math.max(0, Math.min(SAT_SIZE, e.clientX - rect.left));
  const y = Math.max(0, Math.min(SAT_SIZE, e.clientY - rect.top));
  sat.value = x / SAT_SIZE;
  val.value = 1 - y / SAT_SIZE;
  emitFromHsv();
}

function onSatPointerDown(e) {
  satDragging = true;
  e.target.setPointerCapture(e.pointerId);
  handleSatPointer(e);
}

function onSatPointerMove(e) {
  if (!satDragging) return;
  handleSatPointer(e);
}

function onSatPointerUp() {
  satDragging = false;
}

// --- Pointer handling for hue slider ---
let hueDragging = false;

function handleHuePointer(e) {
  const canvas = hueCanvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const x = Math.max(0, Math.min(HUE_WIDTH, e.clientX - rect.left));
  hue.value = (x / HUE_WIDTH) * 360;
  drawSatCanvas();
  emitFromHsv();
}

function onHuePointerDown(e) {
  hueDragging = true;
  e.target.setPointerCapture(e.pointerId);
  handleHuePointer(e);
}

function onHuePointerMove(e) {
  if (!hueDragging) return;
  handleHuePointer(e);
}

function onHuePointerUp() {
  hueDragging = false;
}

// --- Hex input handler ---
function onHexInput(e) {
  let v = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
  hexInput.value = v;
  if (v.length === 6) {
    const [r, g, b] = hexToRgb(v);
    const [h, s, vv] = rgbToHsv(r, g, b);
    hue.value = h;
    sat.value = s;
    val.value = vv;
    drawSatCanvas();
    emitFromHsv();
  }
}

// --- RGB input handler ---
function onRgbInput() {
  const r = Math.max(0, Math.min(255, parseInt(rInput.value) || 0));
  const g = Math.max(0, Math.min(255, parseInt(gInput.value) || 0));
  const b = Math.max(0, Math.min(255, parseInt(bInput.value) || 0));
  rInput.value = r;
  gInput.value = g;
  bInput.value = b;
  const [h, s, v] = rgbToHsv(r, g, b);
  hue.value = h;
  sat.value = s;
  val.value = v;
  drawSatCanvas();
  emitFromHsv();
}

// --- Preset click ---
function selectPreset(hex) {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, v] = rgbToHsv(r, g, b);
  hue.value = h;
  sat.value = s;
  val.value = v;
  drawSatCanvas();
  emitFromHsv();
}

// --- Toggle popup ---
function toggle() {
  open.value = !open.value;
  if (open.value) {
    const rect = triggerRef.value.getBoundingClientRect();
    popupStyle.value = {
      position: 'fixed',
      left: rect.left + 'px',
      top: (rect.bottom + 8) + 'px',
      width: '216px',
      zIndex: 9999,
    };
    nextTick(() => {
      drawSatCanvas();
      drawHueCanvas();
    });
  }
}

// Click outside to close (ignore clicks on the trigger button)
onClickOutside(popupRef, (event) => {
  if (triggerRef.value && triggerRef.value.contains(event.target)) return;
  open.value = false;
});

// Saturation handle position
const satHandleX = computed(() => sat.value * SAT_SIZE);
const satHandleY = computed(() => (1 - val.value) * SAT_SIZE);

// Hue handle position
const hueHandleX = computed(() => (hue.value / 360) * HUE_WIDTH);

onMounted(() => {
  // Initialize from model
  if (model.value && /^[0-9a-fA-F]{6}$/.test(model.value)) {
    const [r, g, b] = hexToRgb(model.value);
    const [h, s, v] = rgbToHsv(r, g, b);
    hue.value = h;
    sat.value = s;
    val.value = v;
  }
  // Always sync inputs so hex/RGB fields reflect current HSV state
  syncInputsFromHsv();
});
</script>

<template>
  <div class="relative inline-block">
    <!-- Trigger swatch -->
    <button
      ref="triggerRef"
      @click="toggle"
      class="h-8 w-8 cursor-pointer rounded-lg border border-gray-200 shadow-sm transition hover:shadow dark:border-gray-700"
      :style="{ backgroundColor: '#' + hexValue }"
      type="button"
      aria-label="Pick color"
    />

    <!-- Popup panel (teleported to body to avoid overflow clipping) -->
    <Teleport to="body">
      <div
        v-if="open"
        ref="popupRef"
        class="rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        :style="popupStyle"
      >
      <!-- Saturation/Brightness canvas -->
      <div class="relative mb-2" :style="{ width: SAT_SIZE + 'px', height: SAT_SIZE + 'px' }">
        <canvas
          ref="satCanvasRef"
          :width="SAT_SIZE"
          :height="SAT_SIZE"
          class="cursor-crosshair rounded-lg"
          @pointerdown="onSatPointerDown"
          @pointermove="onSatPointerMove"
          @pointerup="onSatPointerUp"
        />
        <!-- Handle -->
        <div
          class="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
          :style="{ left: satHandleX + 'px', top: satHandleY + 'px' }"
        />
      </div>

      <!-- Hue slider -->
      <div class="relative mb-3" :style="{ width: HUE_WIDTH + 'px', height: HUE_HEIGHT + 'px' }">
        <canvas
          ref="hueCanvasRef"
          :width="HUE_WIDTH"
          :height="HUE_HEIGHT"
          class="cursor-pointer rounded-full"
          @pointerdown="onHuePointerDown"
          @pointermove="onHuePointerMove"
          @pointerup="onHuePointerUp"
        />
        <!-- Handle -->
        <div
          class="pointer-events-none absolute top-1/2 h-4 w-2 -translate-x-1/2 -translate-y-1/2 rounded border border-white shadow"
          :style="{ left: hueHandleX + 'px' }"
        />
      </div>

      <!-- Hex input -->
      <div class="mb-2 flex items-center gap-1.5">
        <span class="text-xs font-medium text-gray-400">#</span>
        <input
          :value="hexInput"
          @input="onHexInput"
          maxlength="6"
          class="w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-xs text-gray-900 focus:border-[#FF5722] focus:outline-none focus:ring-1 focus:ring-[#FF5722]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          spellcheck="false"
        />
      </div>

      <!-- RGB inputs -->
      <div class="mb-3 flex items-center gap-1.5">
        <div class="flex-1">
          <label class="mb-0.5 block text-center text-[10px] font-medium text-gray-400">R</label>
          <input
            type="number" min="0" max="255"
            :value="rInput"
            @input="(e) => { rInput = e.target.value; onRgbInput(); }"
            class="w-full rounded-md border border-gray-200 bg-gray-50 px-1.5 py-1 text-center font-mono text-xs text-gray-900 focus:border-[#FF5722] focus:outline-none focus:ring-1 focus:ring-[#FF5722]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
        <div class="flex-1">
          <label class="mb-0.5 block text-center text-[10px] font-medium text-gray-400">G</label>
          <input
            type="number" min="0" max="255"
            :value="gInput"
            @input="(e) => { gInput = e.target.value; onRgbInput(); }"
            class="w-full rounded-md border border-gray-200 bg-gray-50 px-1.5 py-1 text-center font-mono text-xs text-gray-900 focus:border-[#FF5722] focus:outline-none focus:ring-1 focus:ring-[#FF5722]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
        <div class="flex-1">
          <label class="mb-0.5 block text-center text-[10px] font-medium text-gray-400">B</label>
          <input
            type="number" min="0" max="255"
            :value="bInput"
            @input="(e) => { bInput = e.target.value; onRgbInput(); }"
            class="w-full rounded-md border border-gray-200 bg-gray-50 px-1.5 py-1 text-center font-mono text-xs text-gray-900 focus:border-[#FF5722] focus:outline-none focus:ring-1 focus:ring-[#FF5722]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
      </div>

      <!-- Preset swatches -->
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="color in presets"
          :key="color"
          @click="selectPreset(color)"
          class="h-5 w-5 rounded border border-gray-200 transition hover:scale-110 dark:border-gray-700"
          :style="{ backgroundColor: '#' + color }"
          type="button"
          :aria-label="'Select color #' + color"
        />
      </div>
      </div>
    </Teleport>
  </div>
</template>
