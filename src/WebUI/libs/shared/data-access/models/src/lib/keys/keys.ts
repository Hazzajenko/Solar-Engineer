export const isDarwin = /Mac|iPod|iPhone|iPad/.test(window.navigator.platform)
export const isWindows = /^Win/.test(window.navigator.platform)
export const isAndroid = /\b(android)\b/i.test(navigator.userAgent)
export const KEYS = {
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_UP: 'ArrowUp',
  BACKSPACE: 'Backspace',
  ALT: 'Alt',
  CTRL_OR_CMD: isDarwin ? 'metaKey' : 'ctrlKey',
  DELETE: 'Delete',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  QUESTION_MARK: '?',
  SPACE: ' ',
  TAB: 'Tab',
  CHEVRON_LEFT: '<',
  CHEVRON_RIGHT: '>',
  PERIOD: '.',
  COMMA: ',',

  A: 'a',
  C: 'c',
  D: 'd',
  E: 'e',
  F: 'f',
  G: 'g',
  H: 'h',
  I: 'i',
  L: 'l',
  O: 'o',
  P: 'p',
  Q: 'q',
  R: 'r',
  S: 's',
  T: 't',
  V: 'v',
  X: 'x',
  Y: 'y',
  Z: 'z',
  K: 'k',

  0: '0',
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
} as const

export type Key = (typeof KEYS)[keyof typeof KEYS]

// const keke: Key = KEYS.ARROW_DOWN;
