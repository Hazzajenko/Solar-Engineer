import { DesignEntityType } from '@design-app/shared'

export type DesignRectModel = {
  id: string
  type: DesignEntityType
  x: number
  y: number
  width: number
  height: number
}

export type DesignRectModelWithDistance = DesignRectModel & {
  distance: number
}
