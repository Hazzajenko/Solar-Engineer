import { EntityType } from '@design-app/shared'
import { XyLocation } from '@shared/data-access/models'
import { newGuid } from '@shared/utils'

export type CanvasPanel = {
  id: string
  type: EntityType
  location: XyLocation
  width: number
  height: number
  rotation: number
}

export const CanvasPanel = {
  create: (location: XyLocation): CanvasPanel => ({
    id: newGuid(),
    type: EntityType.Panel,
    location,
    width: 18,
    height: 23,
    rotation: 0,
  }),
  createFromEvent: (event: MouseEvent): CanvasPanel => ({
    id: newGuid(),
    type: EntityType.Panel,
    location: { x: event.pageX - 18 / 2, y: event.pageY - 23 / 2 },
    width: 18,
    height: 23,
    rotation: 0,
  }),
  createFromEventToScale: (
    event: MouseEvent,
    screenPos: XyLocation,
    scale: number,
  ): CanvasPanel => ({
    id: newGuid(),
    type: EntityType.Panel,
    get location() {
      const centerX = event.pageX - 18 / 2
      const centerY = event.pageY - 23 / 2
      const x = centerX / scale - screenPos.x
      const y = centerY / scale - screenPos.y
      return { x, y }
    },
    width: 18,
    height: 23,
    rotation: 0,
  }),
  updateLocationFromEvent: (panel: CanvasPanel, event: MouseEvent): CanvasPanel => ({
    ...panel,
    location: { x: event.pageX - 18 / 2, y: event.pageY - 23 / 2 },
  }),
  updateLocationFromEventToScale: (
    panel: CanvasPanel,
    event: MouseEvent,
    screenPos: XyLocation,
    scale: number,
  ): CanvasPanel => ({
    ...panel,
    get location() {
      const centerX = event.pageX - 18 / 2
      const centerY = event.pageY - 23 / 2
      const x = centerX / scale - screenPos.x
      const y = centerY / scale - screenPos.y
      return { x, y }
    },
  }),
  updateLocationFromLocation: (panel: CanvasPanel, location: XyLocation): CanvasPanel => ({
    ...panel,
    location,
  }),
  updateLocationFromLocationToScale: (
    panel: CanvasPanel,
    location: XyLocation,
    screenPos: XyLocation,
    scale: number,
  ): CanvasPanel => ({
    ...panel,
    get location() {
      const centerX = location.x
      const centerY = location.y
      const x = centerX / scale - screenPos.x
      const y = centerY / scale - screenPos.y
      return { x, y }
    },
  }),
} as const