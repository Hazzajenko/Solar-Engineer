export const updateObject = <T extends Record<string, any>>(obj: T, updates: Partial<T>): T => {
  let didChange = false
  for (const key in updates) {
    const value = (updates as any)[key]
    if (typeof value !== 'undefined') {
      if ((obj as any)[key] === value && (typeof value !== 'object' || value === null)) {
        continue
      }
      didChange = true
    }
  }

  if (!didChange) {
    return obj
  }

  return {
    ...obj,
    ...updates,
  }
}
