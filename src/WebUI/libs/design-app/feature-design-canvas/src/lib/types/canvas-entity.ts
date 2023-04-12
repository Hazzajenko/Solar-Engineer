import { ObjectSize } from './sizing'
import { EntityType } from '@design-app/shared'
import { UpdateStr } from '@ngrx/entity/src/models'
import { XyLocation } from '@shared/data-access/models'
import { newGuid } from '@shared/utils'


export type CanvasEntity = {
  id: string
  type: EntityType
  location: XyLocation
  width: number
  height: number
  rotation: number
}

export const CanvasEntity = {
  create: (location: XyLocation): CanvasEntity => ({
    id: newGuid(),
    type: EntityType.Panel,
    location,
    width: 18,
    height: 23,
    rotation: 0,
  }),
  updateLocation: (panel: CanvasEntity, location: XyLocation): CanvasEntity => ({
    ...panel,
    location,
  }),
  updateForStore: (
    entity: CanvasEntity,
    changes: Partial<CanvasEntity>,
  ): UpdateStr<CanvasEntity> => ({
    id: entity.id,
    changes,
  }),
  updateLocationFromEvent: (panel: CanvasEntity, event: MouseEvent): CanvasEntity => ({
    ...panel,
    location: { x: event.pageX - 18 / 2, y: event.pageY - 23 / 2 },
  }),
  updateLocationFromEventToScale: (
    panel: CanvasEntity,
    event: MouseEvent,
    screenPos: XyLocation,
    scale: number,
  ): CanvasEntity => ({
    ...panel,
    get location() {
      const centerX = event.pageX - 18 / 2
      const centerY = event.pageY - 23 / 2
      const x = centerX / scale - screenPos.x
      const y = centerY / scale - screenPos.y
      return { x, y }
    },
  }),
  updateLocationFromLocation: (panel: CanvasEntity, location: XyLocation): CanvasEntity => ({
    ...panel,
    location,
  }),
  updateLocationFromLocationToScale: (
    panel: CanvasEntity,
    location: XyLocation,
    screenPos: XyLocation,
    scale: number,
  ): CanvasEntity => ({
    ...panel,
    get location() {
      const centerX = location.x
      const centerY = location.y
      const x = centerX / scale - screenPos.x
      const y = centerY / scale - screenPos.y
      return { x, y }
    },
  }),
  defaultSize: { width: 18, height: 23 } as ObjectSize,
} as const