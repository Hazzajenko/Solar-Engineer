export const isStartingSelectionBox = (event: MouseEvent): boolean => {
  return event.shiftKey && event.button === 0
}
