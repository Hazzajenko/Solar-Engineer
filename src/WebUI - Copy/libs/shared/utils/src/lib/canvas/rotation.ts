export const rotate = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  angle: number,
): [number, number] =>
  // 𝑎′𝑥=(𝑎𝑥−𝑐𝑥)cos𝜃−(𝑎𝑦−𝑐𝑦)sin𝜃+𝑐𝑥
  // 𝑎′𝑦=(𝑎𝑥−𝑐𝑥)sin𝜃+(𝑎𝑦−𝑐𝑦)cos𝜃+𝑐𝑦.
  // https://math.stackexchange.com/questions/2204520/how-do-i-rotate-a-line-segment-in-a-specific-point-on-the-line
  [
    (x1 - x2) * Math.cos(angle) - (y1 - y2) * Math.sin(angle) + x2,
    (x1 - x2) * Math.sin(angle) + (y1 - y2) * Math.cos(angle) + y2,
  ]

export type RotatePoint = Readonly<[number, number]>
export const rotatePoint = (
  point: RotatePoint,
  center: RotatePoint,
  angle: number,
): [number, number] => rotate(point[0], point[1], center[0], center[1], angle)

export const adjustXYWithRotation = (
  sides: {
    n?: boolean
    e?: boolean
    s?: boolean
    w?: boolean
  },
  x: number,
  y: number,
  angle: number,
  deltaX1: number,
  deltaY1: number,
  deltaX2: number,
  deltaY2: number,
): [number, number] => {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  if (sides.e && sides.w) {
    x += deltaX1 + deltaX2
  } else if (sides.e) {
    x += deltaX1 * (1 + cos)
    y += deltaX1 * sin
    x += deltaX2 * (1 - cos)
    y += deltaX2 * -sin
  } else if (sides.w) {
    x += deltaX1 * (1 - cos)
    y += deltaX1 * -sin
    x += deltaX2 * (1 + cos)
    y += deltaX2 * sin
  }

  if (sides.n && sides.s) {
    y += deltaY1 + deltaY2
  } else if (sides.n) {
    x += deltaY1 * sin
    y += deltaY1 * (1 - cos)
    x += deltaY2 * -sin
    y += deltaY2 * (1 + cos)
  } else if (sides.s) {
    x += deltaY1 * -sin
    y += deltaY1 * (1 + cos)
    x += deltaY2 * sin
    y += deltaY2 * (1 - cos)
  }
  return [x, y]
}
