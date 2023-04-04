export const InitCanvas = (canvas: HTMLCanvasElement, width: string, height: string) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Could not get canvas context')
  }
  canvas.style.position = 'absolute'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.zIndex = '100'
  canvas.style.pointerEvents = 'none'
  canvas.width = Number(width.split('p')[0])
  canvas.height = Number(height.split('p')[0])
  // canvas.width = window.innerWidth
  // canvas.height = window.innerHeight
  /*  const offsetWidth = window.innerWidth
   const offsetHeight = window.innerHeight
   const left = (window.innerWidth - offsetWidth) / 2
   const top = (window.innerHeight - offsetHeight) / 2*/
  return {
    canvas,
    ctx,
    // left,
    // top,
  }
}
