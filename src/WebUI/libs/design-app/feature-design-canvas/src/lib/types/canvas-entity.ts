import { AngleRadians } from '../utils'
import { ENTITY_TYPE, EntityType } from '@design-app/shared'
import { UpdateStr } from '@ngrx/entity/src/models'
import { Point } from '@shared/data-access/models'
import { newGuid } from '@shared/utils'


export type CanvasEntity = {
  id: string
  type: EntityType
  location: Point
  width: number
  height: number
  angle: AngleRadians
}

export const EntityFactory = {
  create: (type: EntityType, location: Point): CanvasEntity => {
    const { width, height } = SizeByType[type]
    return {
      id: newGuid(),
      type,
      location,
      width,
      height,
      angle: 0 as AngleRadians,
    }
  },
  update: (entity: CanvasEntity, changes: Partial<CanvasEntity>): CanvasEntity => {
    return {
      ...entity,
      ...changes,
    }
  },
  updateForStore: (
    entity: CanvasEntity,
    changes: Partial<CanvasEntity>,
  ): UpdateStr<CanvasEntity> => {
    return {
      id: entity.id,
      changes,
    }
  },
} as const

export const SizeByType = {
  [ENTITY_TYPE.Panel]: { width: 18, height: 23 },
}