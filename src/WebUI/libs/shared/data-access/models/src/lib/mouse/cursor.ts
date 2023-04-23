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

// 0: No button or un-initialized
// 1: Primary button (usually the left button)
// 2: Secondary button (usually the right button)
// 4: Auxiliary button (usually the mouse wheel button or middle button)
// 8: 4th button (typically the "Browser Back" button)
// 16 : 5th button (typically the "Browser Forward" button)
export const EVENT_BUTTON = {
  NO_BUTTON: 0,
  PRIMARY: 1,
  SECONDARY: 2,
  AUXILIARY: 4,
  FOURTH: 8,
  FIFTH: 16,
} as const

export type EventButton = (typeof EVENT_BUTTON)[keyof typeof EVENT_BUTTON]
