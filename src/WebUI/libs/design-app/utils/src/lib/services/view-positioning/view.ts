import { XyLocation } from '@shared/data-access/models'

const view = (() => {
  // current view transform
  const m = [1, 0, 0, 1, 0, 0] // alias
  let scale = 1 // current scale
  const pos = { x: 0, y: 0 } // current position of origin
  let dirty = true
  console.log('view', m, scale, pos, dirty)
  // console.log('view', this)
  return {
    applyTo(el: HTMLDivElement) {
      if (dirty) {
        this.update()
      }
      el.style.transform = `matrix(${m[0]},${m[1]},${m[2]},${m[3]},${m[4]},${m[5]})`
    },
    update() {
      dirty = false
      m[3] = m[0] = scale
      m[2] = m[1] = 0
      m[4] = pos.x
      m[5] = pos.y
    },
    pan(amount: XyLocation) {
      if (dirty) {
        this.update()
      }
      pos.x += amount.x
      pos.y += amount.y
      dirty = true
    },
    scaleAt(at: XyLocation, amount: number) {
      // at in screen coords
      if (dirty) {
        this.update()
      }
      scale *= amount
      pos.x = at.x - (at.x - pos.x) * amount
      pos.y = at.y - (at.y - pos.y) * amount
      dirty = true
    },
  }
})()

const mouse = { x: 0, y: 0, oldX: 0, oldY: 0, button: false }

export function mouseWheelEvent(event: WheelEvent, zoomMe: HTMLDivElement) {
  const zoomMeRect = zoomMe.getBoundingClientRect()
  const x = event.pageX - zoomMeRect.width / 2
  const y = event.pageY - zoomMeRect.height / 2
  if (event.deltaY < 0) {
    view.scaleAt({ x, y }, 1.1)
    view.applyTo(zoomMe)
  } else {
    view.scaleAt({ x, y }, 1 / 1.1)
    view.applyTo(zoomMe)
  }
  event.preventDefault()
}