import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Ensure a minimal `localStorage` is available in the test environment.
// Some Node environments may not provide `localStorage`; provide a small
// in-memory fallback so tests can call `localStorage.clear()` safely.
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - assign a simple mock to globalThis for tests
  globalThis.localStorage = {
    getItem: (key: string) => (store.has(key) ? (store.get(key) ?? null) : null),
    setItem: (key: string, value: string) => store.set(key, String(value)),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size
    },
  }
}

afterEach(cleanup)
