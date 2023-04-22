import { AXIS, Axis } from '../types'
import { EntityBounds } from './entity-bounds'

export const getEntityAxisGridLines = (entity: EntityBounds, axis: Axis): number[] => {
  if (axis === 'x') {
    return [entity.top, entity.bottom]
  }
  return [entity.left, entity.right]
}

export const getViewLengthLineByAxis = (bounds: EntityBounds, axis: Axis): number[][][] => {
  if (axis === 'x') {
    return [
      [
        [0, bounds.top],
        [window.innerWidth, bounds.top],
      ],
      [
        [0, bounds.bottom],
        [window.innerWidth, bounds.bottom],
      ],
    ]
  }
  return [
    [
      [bounds.left, 0],
      [bounds.left, window.innerHeight],
    ],
    [
      [bounds.right, 0],
      [bounds.right, window.innerHeight],
    ],
  ]
  // return bounds.width
}

export const getEntityAxisGridLinesByAxis = (bounds: EntityBounds, axis: Axis): number[][] => {
  if (axis === 'x') {
    return [
      [0, bounds.top],
      [window.innerWidth, bounds.top],
      [0, bounds.bottom],
      [window.innerWidth, bounds.bottom],
    ]
  }
  return [
    [bounds.left, 0],
    [bounds.left, window.innerHeight],
    [bounds.right, 0],
    [bounds.right, window.innerHeight],
  ]
}

export const getEntityAxisGridLinesByAxisV2 = (bounds: EntityBounds, axis: Axis): number[][] => {
  if (axis === AXIS.Y) {
    return [
      [0, bounds.top, window.innerWidth, bounds.top],
      [0, bounds.bottom, window.innerWidth, bounds.bottom],
    ]
  }
  return [
    [bounds.left, 0, bounds.left, window.innerHeight],
    [bounds.right, 0, bounds.right, window.innerHeight],
  ]
}

export const getEntityAxisGridLinesByAxisV3 = (bounds: EntityBounds, axis: Axis) => {
  if (axis === 'x') {
    return {
      top: [0, bounds.top, window.innerWidth, bounds.top],
      bottom: [
        [bounds.left, bounds.bottom],
        [bounds.right, bounds.bottom],
      ],
    }
    return [
      [
        [0, bounds.top],
        [window.innerWidth, bounds.top],
      ],
      [
        [0, bounds.bottom],
        [window.innerWidth, bounds.bottom],
      ],
    ]
  }
  return [
    [
      [bounds.left, 0],
      [bounds.left, window.innerHeight],
    ],
    [
      [bounds.right, 0],
      [bounds.right, window.innerHeight],
    ],
  ]
}

/*
 const vectorLineIntersect = (p0: number[], p1: number[], p2: number[], p3: number[]) => {
 const s1x = p1[0] - p0[0]
 const s1y = p1[1] - p0[1]
 const s2x = p3[0] - p2[0]
 const s2y = p3[1] - p2[1]

 const s = (-s1y * (p0[0] - p2[0]) + s1x * (p0[1] - p2[1])) / (-s2x * s1y + s1x * s2y)
 const t = (s2x * (p0[1] - p2[1]) - s2y * (p0[0] - p2[0])) / (-s2x * s1y + s1x * s2y)

 return s >= 0 && s <= 1 && t >= 0 && t <= 1
 }*/