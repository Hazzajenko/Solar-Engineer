export const MouseEvent = {
  MouseDown: 'mousedown',
  MouseUp: 'mouseup',
  MouseMove: 'mousemove',
  MouseEnter: 'mouseenter',
  MouseLeave: 'mouseleave',
  MouseOver: 'mouseover',
  MouseOut: 'mouseout',
  Click: 'click',
  ContextMenu: 'contextmenu',
  DoubleClick: 'dblclick',
  Wheel: 'wheel',
  MouseWheel: 'mousewheel',
  /*  TouchStart: 'touchstart',
   TouchEnd: 'touchend',
   TouchMove: 'touchmove',
   TouchCancel: 'touchcancel',
   PointerDown: 'pointerdown',
   PointerUp: 'pointerup',
   PointerMove: 'pointermove',
   PointerEnter: 'pointerenter',
   PointerLeave: 'pointerleave',
   PointerOver: 'pointerover',
   PointerOut: 'pointerout',
   PointerCancel: 'pointercancel',
   GotPointerCapture: 'gotpointercapture',
   LostPointerCapture: 'lostpointercapture',
   PointerEvent: 'pointerEvent',
   DragStart: 'dragstart',*/
} as const

export type MouseEvent = (typeof MouseEvent)[keyof typeof MouseEvent]

export type MouseEvents = {
  [key in MouseEvent]: MouseEvent
}

export const MouseDownEvent = MouseEvent.MouseDown
export const MouseUpEvent = MouseEvent.MouseUp
export const MouseMoveEvent = MouseEvent.MouseMove
export const MouseEnterEvent = MouseEvent.MouseEnter
export const MouseLeaveEvent = MouseEvent.MouseLeave
export const MouseOverEvent = MouseEvent.MouseOver
export const MouseOutEvent = MouseEvent.MouseOut
export const ClickEvent = MouseEvent.Click
export const ContextMenuEvent = MouseEvent.ContextMenu
export const DoubleClickEvent = MouseEvent.DoubleClick
export const ScrollWheelEvent = MouseEvent.Wheel
export const MouseWheelEvent = MouseEvent.MouseWheel
