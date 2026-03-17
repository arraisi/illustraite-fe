import { ref, watch } from 'vue';
import { useWebSocket } from '@vueuse/core';

export function useGenerationSocket(generationId) {
  const status = ref('connecting');
  const imageUrl = ref(null);
  const error = ref(null);

  const url = `${import.meta.env.VITE_WS_BASE_URL}/status?generation_id=${generationId}`;

  const { data, close } = useWebSocket(url, {
    autoReconnect: false,
    onConnected() {
      status.value = 'connected';
    },
    onError() {
      status.value = 'error';
      error.value = 'WebSocket connection failed';
    },
    onDisconnected() {
      if (status.value === 'connecting' || status.value === 'connected') {
        status.value = 'disconnected';
      }
    },
  });

  watch(data, (raw) => {
    if (!raw) return;

    try {
      const message = JSON.parse(raw);

      if (message.status === 'completed' && message.image_url) {
        status.value = 'completed';
        imageUrl.value = message.image_url;
        close();
      } else if (message.status === 'failed') {
        status.value = 'failed';
        error.value = message.error || 'Generation failed';
        close();
      } else if (message.status) {
        status.value = message.status;
      }
    } catch {
      error.value = 'Invalid message from server';
    }
  });

  return { status, imageUrl, error, close };
}
