import { createDefaultArrayFromConst } from '@shared/utils'

export const DIV_ELEMENT = {
  FPS: 'fps',
  MOUSE_POS: 'mouse-pos',
  TRANSFORMED_MOUSE_POS: 'transformed-mouse-pos',
  STRING_STATS: 'string-stats',
  PANEL_STATS: 'panel-stats',
  ROTATE_STATS: 'rotate-stats',
  SCALE_ELEMENT: 'scale-element',
} as const

export type DivElement = (typeof DIV_ELEMENT)[keyof typeof DIV_ELEMENT]

/*const myArray = Object.values(DIV_ELEMENT) as Array<DivElement[keyof DivElement]>
 myArray.forEach((element) => {
 console.log(element)
 })*/
export const InitialDivElements = createDefaultArrayFromConst(DIV_ELEMENT) as Array<DivElement>
// export type DivElementState = Array<>
/*
 const arr: DivElementState = [
 {
 fps: 'fps',
 },
 ]*/

/*
 export const InitialDivElementState = [
 DIV_ELEMENT.FPS,
 DIV_ELEMENT.MOUSE_POS,
 DIV_ELEMENT.TRANSFORMED_MOUSE_POS,
 DIV_ELEMENT.STRING_STATS,
 DIV_ELEMENT.PANEL_STATS,
 DIV_ELEMENT.ROTATE_STATS,
 DIV_ELEMENT.SCALE_ELEMENT,
 ] as const
 */