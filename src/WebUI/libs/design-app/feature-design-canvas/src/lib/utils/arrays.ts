export const pushItemIfNotExists = <T>(array: T[], item: T) => {
  if (array.includes(item)) return
  array.push(item)
  return array
}

export const pushItemsIfNotExist = <T>(array: T[], items: T[]) => {
  const newItems = items.filter((item) => !array.includes(item))
  array.push(...newItems)
  return array
}

export const removeItemIfExists = <T>(array: T[], item: T) => {
  const index = array.indexOf(item)
  if (index === -1) return
  array.splice(index, 1)
  return array
}

export const removeItemsIfExists = <T>(array: T[], items: T[]) => {
  const newItems = items.filter((item) => array.includes(item))
  newItems.forEach((item) => array.splice(array.indexOf(item), 1))
  return array
}
