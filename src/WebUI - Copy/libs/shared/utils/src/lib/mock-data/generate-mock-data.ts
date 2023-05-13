export function generateMockData<T>(count: number, dataTemplate: Record<keyof T, () => any>): T[] {
  const data: T[] = []

  for (let i = 0; i < count; i++) {
    const item = Object.fromEntries(
      Object.entries(dataTemplate).map(([key, fn]: [key: string, fn: any]) => [key, fn()]),
    ) as Record<keyof T, any>

    data.push(item as T)
  }

  return data
}
