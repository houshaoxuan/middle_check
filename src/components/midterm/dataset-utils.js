export function getDatasetDisplayName(dataset) {
  return dataset?.displayName || dataset?.label || dataset?.name || dataset?.key || '';
}

export function getDatasetApiKey(dataset) {
  return dataset?.apiKey || dataset?.key;
}
