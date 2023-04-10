import { EntityType } from '@design-app/shared'

export type EntityDivElement = {
  id: string
  type: EntityType
  element: HTMLDivElement
}

export type EntityDivElementWithPoints = EntityDivElement & {
  points: [number, number][]
}

export type EntityElement = {
  id: string
  type: EntityType
  x: number
  y: number
  width: number
  height: number
  // angle: number
}