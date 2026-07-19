// Opens a fetched Blob in a new tab (PDF/image preview) and revokes the object
// URL shortly after — long enough for the browser to load it into the new tab.
export function viewBlob(blob: Blob) {
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
