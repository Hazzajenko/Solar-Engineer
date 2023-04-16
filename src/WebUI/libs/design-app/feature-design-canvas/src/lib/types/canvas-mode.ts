export const CANVAS_MODE = {
  SELECT: 'select',
  CREATE: 'create',
} as const

export type CanvasMode = (typeof CANVAS_MODE)[keyof typeof CANVAS_MODE]
