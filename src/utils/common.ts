/**
 * Common Utility Functions
 * Provides reusable helpers for type checking, empty checks, and common operations
 */

/**
 * Type guard to check if a value is not null or undefined
 */
export function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Type guard to check if a string is not empty
 */
export function isNotEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Type guard to check if an array is not empty
 * Works with both mutable and readonly arrays
 */
export function isNotEmptyArray<T>(value: T[] | readonly T[] | undefined | null): value is T[] {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Check if a value is null, undefined, or empty string
 */
export function isNullOrEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  return false;
}

/**
 * Check if an array is null, undefined, or empty
 */
export function isArrayEmpty<T>(value: T[] | undefined | null): boolean {
  return !isNotEmptyArray(value);
}

/**
 * Check if an object is null, undefined, or has no keys
 */
export function isObjectEmpty<T extends object>(value: T | undefined | null): boolean {
  if (value === null || value === undefined) return true;
  return Object.keys(value).length === 0;
}

/**
 * Safely access nested object properties with optional chaining
 * Returns the value or a default if any intermediate property is null/undefined
 */
export function safeAccess<T, D = undefined>(
  obj: T,
  accessor: (obj: T) => D,
  defaultValue: D
): D {
  try {
    const value = accessor(obj);
    return value ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Safely parse JSON without throwing
 */
export function safeJsonParse<T = unknown>(
  jsonString: string,
  fallback: T
): T {
  try {
    const parsed = JSON.parse(jsonString);
    return parsed as T;
  } catch {
    return fallback;
  }
}

/**
 * Safely get array from possibly null/undefined source
 * Returns empty array if source is null/undefined/not an array
 */
export function getArraySafely<T>(value: T[] | undefined | null): T[] {
  if (isArrayEmpty(value)) return [];
  return value as T[];
}

/**
 * Safely get object from possibly null/undefined source
 * Returns empty object if source is null/undefined/not an object
 */
export function getObjectSafely<T extends object>(value: T | undefined | null): T | Record<string, never> {
  if (isObjectEmpty(value)) return {};
  return value as T;
}

/**
 * Safely get string value with fallback
 */
export function getStringSafely(value: unknown, fallback: string = ''): string {
  if (isNotEmptyString(value)) return value;
  return fallback;
}

/**
 * Safely get number value with fallback
 */
export function getNumberSafely(value: unknown, fallback: number = 0): number {
  if (typeof value === 'number' && !isNaN(value)) return value;
  return fallback;
}

/**
 * Safely get boolean value with fallback
 */
export function getBooleanSafely(value: unknown, fallback: boolean = false): boolean {
  if (typeof value === 'boolean') return value;
  return fallback;
}

/**
 * Check if all items in an array satisfy a condition
 */
export function allItemsSatisfy<T>(
  array: T[] | undefined | null,
  predicate: (item: T) => boolean
): boolean {
  if (isArrayEmpty(array)) return false;
  return (array as T[]).every(predicate);
}

/**
 * Check if any item in an array satisfies a condition
 */
export function anyItemSatisfies<T>(
  array: T[] | undefined | null,
  predicate: (item: T) => boolean
): boolean {
  if (isArrayEmpty(array)) return false;
  return (array as T[]).some(predicate);
}

/**
 * Safely call a function with arguments, returning default on error
 */
export function safeCall<T, Args extends unknown[], D = undefined>(
  fn: (...args: Args) => T,
  args: Args,
  defaultValue: D
): T | D {
  try {
    return fn(...args);
  } catch {
    return defaultValue;
  }
}

/**
 * Create a debounced version of a function
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Clamp a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate a unique identifier
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}_${randomStr}` : `${timestamp}_${randomStr}`;
}

/**
 * Sleep for a specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = initialDelayMs * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}
