export const LINKED_TO_SELECTED = {
  NOT_LINKED: 'NotLinked',
  POSITIVE: 'Positive',
  NEGATIVE: 'Negative',
} as const

export type LinkedToSelected = (typeof LINKED_TO_SELECTED)[keyof typeof LINKED_TO_SELECTED]
