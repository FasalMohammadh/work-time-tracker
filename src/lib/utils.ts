function getIsClient() {
  return globalThis.window !== undefined;
}

export { getIsClient };
