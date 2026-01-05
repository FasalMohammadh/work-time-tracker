function getIsClient() {
  return globalThis.window !== undefined;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36);
}

export { getIsClient, generateId };
