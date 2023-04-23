export const getHtmlDivElementById = (id: string): HTMLDivElement => {
  const element = document.getElementById(id)
  if (!element) {
    throw new Error('No element found')
  }
  return element as HTMLDivElement
}
