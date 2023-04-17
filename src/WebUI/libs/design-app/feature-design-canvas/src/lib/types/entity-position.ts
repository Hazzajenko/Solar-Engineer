import { EntityType } from '@design-app/shared'
import { Point } from '@shared/data-access/models'

export type EntityPosition = {
  id: string
  type: EntityType
  location: Point
  rotation: number
}

export type EntityLocation = Omit<EntityPosition, 'rotation'>

export type EntityRotation = Omit<EntityPosition, 'position'>