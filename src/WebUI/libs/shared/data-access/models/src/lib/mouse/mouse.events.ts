/*
 export type EventType =
 | 'copy'
 | 'cut'
 | 'paste'
 | 'compositionEnd'
 | 'compositionStart'
 | 'compositionUpdate'
 | 'keyDown'
 | 'keyPress'
 | 'keyUp'
 | 'focus'
 | 'blur'
 | 'focusIn'
 | 'focusOut'
 | 'change'
 | 'input'
 | 'invalid'
 | 'submit'
 | 'reset'
 | 'click'
 | 'contextMenu'
 | 'dblClick'
 | 'drag'
 | 'dragEnd'
 | 'dragEnter'
 | 'dragExit'
 | 'dragLeave'
 | 'dragOver'
 | 'dragStart'
 | 'drop'
 | 'mouseDown'
 | 'mouseEnter'
 | 'mouseLeave'
 | 'mouseMove'
 | 'mouseOut'
 | 'mouseOver'
 | 'mouseUp'
 | 'popState'
 | 'select'
 | 'touchCancel'
 | 'touchEnd'
 | 'touchMove'
 | 'touchStart'
 | 'resize'
 | 'scroll'
 | 'wheel'
 | 'abort'
 | 'canPlay'
 | 'canPlayThrough'
 | 'durationChange'
 | 'emptied'
 | 'encrypted'
 | 'ended'
 | 'loadedData'
 | 'loadedMetadata'
 | 'loadStart'
 | 'pause'
 | 'play'
 | 'playing'
 | 'progress'
 | 'rateChange'
 | 'seeked'
 | 'seeking'
 | 'stalled'
 | 'suspend'
 | 'timeUpdate'
 | 'volumeChange'
 | 'waiting'
 | 'load'
 | 'error'
 | 'animationStart'
 | 'animationEnd'
 | 'animationIteration'
 | 'transitionCancel'
 | 'transitionEnd'
 | 'transitionRun'
 | 'transitionStart'
 | 'doubleClick'
 | 'pointerOver'
 | 'pointerEnter'
 | 'pointerDown'
 | 'pointerMove'
 | 'pointerUp'
 | 'pointerCancel'
 | 'pointerOut'
 | 'pointerLeave'
 | 'gotPointerCapture'
 | 'lostPointerCapture'*/
import { Point } from '../location'

export const EVENT_TYPE = {
	MOUSE_DOWN: 'mousedown',
	MOUSE_UP: 'mouseup',
	MOUSE_MOVE: 'mousemove',
	MOUSE_ENTER: 'mouseenter',
	MOUSE_LEAVE: 'mouseleave',
	MOUSE_OVER: 'mouseover',
	MOUSE_OUT: 'mouseout',
	POINTER_MOVE: 'pointermove',
	POINTER_UP: 'pointerup',
	POINTER_DOWN: 'pointerdown',
	POINTER_OVER: 'pointerover',
	POINTER_OUT: 'pointerout',
	POINTER_ENTER: 'pointerenter',
	POINTER_LEAVE: 'pointerleave',
	POINTER_CANCEL: 'pointercancel',
	CLICK: 'click',
	CONTEXT_MENU: 'contextmenu',
	DOUBLE_CLICK: 'dblclick',
	WHEEL: 'wheel',
	MOUSE_WHEEL: 'mousewheel',
	KEY_UP: 'keyup',
	GESTURE_END: 'gestureend',
	GESTURE_START: 'gesturestart',
	GESTURE_CHANGE: 'gesturechange',
	TOUCH_START: 'touchstart',
	TOUCH_END: 'touchend',
	TOUCH_MOVE: 'touchmove',
	TOUCH_CANCEL: 'touchcancel',
} as const

export type EventType = (typeof EVENT_TYPE)[keyof typeof EVENT_TYPE]

export type Gesture = {
	pointers: Map<number, Point>
	lastCenter: Point | null
	initialCenter: Point | null
	initialDistance: number | null
	lastDistance: number | null
	initialScale: number | null
}

export declare class GestureEvent extends UIEvent {
	readonly rotation: number
	readonly scale: number
}

export type MouseEvents = {
	[key in EventType]: EventType
}

export const MouseDownEvent = EVENT_TYPE.MOUSE_DOWN
export const MouseUpEvent = EVENT_TYPE.MOUSE_UP
export const MouseMoveEvent = EVENT_TYPE.MOUSE_MOVE
export const MouseEnterEvent = EVENT_TYPE.MOUSE_ENTER
export const MouseLeaveEvent = EVENT_TYPE.MOUSE_LEAVE
export const MouseOverEvent = EVENT_TYPE.MOUSE_OVER
export const MouseOutEvent = EVENT_TYPE.MOUSE_OUT
export const ClickEvent = EVENT_TYPE.CLICK
export const ContextMenuEvent = EVENT_TYPE.CONTEXT_MENU
export const DoubleClickEvent = EVENT_TYPE.DOUBLE_CLICK
export const ScrollWheelEvent = EVENT_TYPE.WHEEL
export const MouseWheelEvent = EVENT_TYPE.MOUSE_WHEEL
