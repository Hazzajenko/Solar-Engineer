export const initCanvas = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
  // let canvas => (ele: HTMLCanvasElement)
  // let canvas = new HTMLCanvasElement
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
  return canvas
}
