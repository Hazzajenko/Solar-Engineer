export const CURSOR_TYPE = {
  TEXT: 'text',
  CROSSHAIR: 'crosshair',
  GRABBING: 'grabbing',
  GRAB: 'grab',
  POINTER: 'pointer',
  MOVE: 'move',
  AUTO: '',
} as const

export type CursorType = (typeof CURSOR_TYPE)[keyof typeof CURSOR_TYPE]
export const POINTER_BUTTON = {
  MAIN: 0,
  WHEEL: 1,
  SECONDARY: 2,
  TOUCH: -1,
} as const

export type PointerButton = (typeof POINTER_BUTTON)[keyof typeof POINTER_BUTTON]
