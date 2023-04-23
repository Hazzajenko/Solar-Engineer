export const KEY_CATEGORY = {
  COPY_PASTE: 'Copy/Paste',
  STATE_MANAGE: 'State Management',
  OBJECT_POSITION: 'Object Position',
  VIEW_POSITION: 'View Position',
  GRID: 'Grid',
} as const

export type KeyCategory = (typeof KEY_CATEGORY)[keyof typeof KEY_CATEGORY]
