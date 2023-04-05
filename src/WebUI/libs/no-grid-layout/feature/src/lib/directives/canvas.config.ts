export const InitCanvas = (
  canvas: HTMLCanvasElement,
  layoutWidth: number,
  layoutHeight: number,
) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Could not get canvas context')
  }
  // canvas.style.position = 'relative'
  canvas.style.position = 'absolute'
  canvas.style.top = '0'
  canvas.style.left = '0'
  // canvas
  canvas.style.zIndex = '100'
  canvas.style.pointerEvents = 'none'
  // canvas.width = Number(width.split('p')[0])
  // canvas.height = Number(height.split('p')[0])
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  // canvas.width = "100%"
  // canvas.height = "100%"
  // canvas.width = layoutWidth
  // canvas.height = layoutHeight
  // this._renderer.setStyle(this._scrollElement, 'width', `${layoutWidth}px`)
  // this._renderer.setStyle(this._scrollElement, 'height', `${layoutHeight}px`)
  // const left = (window.innerWidth - layoutWidth) / 2
  // const top = (window.innerHeight - layoutHeight) / 2
  // canvas.style.left = `${left}px`
  // canvas.style.top = `${top}px`
  // this._renderer.setStyle(this._scrollElement, 'left', `${left}px`)
  // this._renderer.setStyle(this._scrollElement, 'top', `${top}px`)
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
