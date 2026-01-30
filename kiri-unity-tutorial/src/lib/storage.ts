/**
 * Утилиты для работы с localStorage
 */

/**
 * Безопасно получает значение из localStorage
 */
export function getStorageItem<T>(key: string, defaultValue: T | null = null): T | null {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Безопасно сохраняет значение в localStorage
 */
export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

/**
 * Безопасно удаляет значение из localStorage
 */
export function removeStorageItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
