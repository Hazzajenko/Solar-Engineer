export const EventName = {
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

export type MouseEvent = (typeof EventName)[keyof typeof EventName]

export type MouseEvents = {
  [key in MouseEvent]: MouseEvent
}

export const MouseDownEvent = EventName.MouseDown
export const MouseUpEvent = EventName.MouseUp
export const MouseMoveEvent = EventName.MouseMove
export const MouseEnterEvent = EventName.MouseEnter
export const MouseLeaveEvent = EventName.MouseLeave
export const MouseOverEvent = EventName.MouseOver
export const MouseOutEvent = EventName.MouseOut
export const ClickEvent = EventName.Click
export const ContextMenuEvent = EventName.ContextMenu
export const DoubleClickEvent = EventName.DoubleClick
export const ScrollWheelEvent = EventName.Wheel
export const MouseWheelEvent = EventName.MouseWheel
