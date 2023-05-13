export function calculateSceneLayoutSize() {
  const blockHeight = 32
  const blockWidth = 32
  const rows = Math.floor((window.innerHeight - 100) / blockHeight)
  const cols = Math.floor((window.innerWidth - 100) / blockWidth)
  const sceneHeight = rows * blockHeight
  const sceneWidth = cols * blockWidth
  return { sceneHeight, sceneWidth }
}

export function calculateLeftRightPositionForScene() {
  const { sceneHeight, sceneWidth } = calculateSceneLayoutSize()
  const width = sceneWidth * 1.5
  const height = sceneHeight * 1.5
  const left = (window.innerWidth - width) / 2
  const top = (window.innerHeight - height) / 2
  return { left, top, width, height }
}
