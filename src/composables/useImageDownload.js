export function useImageDownload() {
  async function download(url, filename = 'illustraite-image.png') {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(objectUrl);
  }

  return { download };
}
