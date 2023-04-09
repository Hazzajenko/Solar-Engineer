import { EntityType } from '@design-app/shared'

export type DesignRectModel = {
  id: string
  type: EntityType
  x: number
  y: number
  width: number
  height: number
}

export type DesignRectModelWithDistance = DesignRectModel & {
  distance: number
}