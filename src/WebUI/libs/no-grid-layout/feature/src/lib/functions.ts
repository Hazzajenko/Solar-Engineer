export const getPanelElementById = (id: string) => {
  const panels = document.querySelectorAll('[panelId]')
  if (!panels) {
    return
  }
  return Array.from(panels).find((p) => p.getAttribute('panelId') === id)
}
