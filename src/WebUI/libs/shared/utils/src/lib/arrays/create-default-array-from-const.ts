/*const TEST = {}

 type Test = typeof TEST

 type TestKeys = keyof Test

 const myArray = <X extends object, T extends (typeof data)[keyof typeof data]>(data: X) =>
 Object.values(data) as Array<T[keyof T]>*/

export const createDefaultArrayFromConst = <T extends Record<string, unknown>>(data: T) =>
  Object.values(data) as Array<T[keyof T]>

/*
 export const DIV_ELEMENT = {
 FPS: 'fps',
 MOUSE_POS: 'mouse-pos',
 TRANSFORMED_MOUSE_POS: 'transformed-mouse-pos',
 STRING_STATS: 'string-stats',
 PANEL_STATS: 'panel-stats',
 ROTATE_STATS: 'rotate-stats',
 SCALE_ELEMENT: 'scale-element',
 } as const

 export type DivElement = (typeof DIV_ELEMENT)[keyof typeof DIV_ELEMENT]*/
