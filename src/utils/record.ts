export function extractKeys(mappings?: Record<string, string>) {
  return mappings ? Object.keys(mappings) : [];
}

export function lookupValue(mappings?: Record<string, string>, key?: string) {
  if (mappings && key) {
    return mappings[key];
  }
}
