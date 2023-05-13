export function ThrowIfNull<T>(value: T | null | undefined, message?: string): T {
  if (value === null || value === undefined) {
    throw new Error(message ?? 'Value is null or undefined')
  }
  return value
}
