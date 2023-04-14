import { ENTITY_TYPE, EntityType } from '@design-app/shared'
import { UpdateStr } from '@ngrx/entity/src/models'
import { XyLocation } from '@shared/data-access/models'
import { newGuid } from '@shared/utils'

export type CanvasEntity = {
  id: string
  type: EntityType
  location: XyLocation
  width: number
  height: number
  angle: number
}

export const EntityFactory = {
  create: (type: EntityType, location: XyLocation): CanvasEntity => {
    const { width, height } = SizeByType[type]
    return {
      id: newGuid(),
      type,
      location,
      width,
      height,
      angle: 0,
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
/*
 export class CanvasEntity {
 id: string
 type: EntityType
 location: XyLocation
 width: number
 height: number
 rotation: number

 constructor(type: EntityType, location: XyLocation) {
 this.id = newGuid()
 this.type = type
 this.location = location
 const { width, height } = SizeByType[type]
 this.width = width
 this.height = height
 this.rotation = 0
 }

 /!*  updateWithNewInstance(instance: CanvasEntity): CanvasEntity {
 this.id = instance.id
 this.type = instance.type
 this.location = instance.location
 this.width = instance.width
 this.height = instance.height
 this.rotation = instance.rotation
 return this
 }*!/

 updateLocation(location: XyLocation): CanvasEntity {
 /!*    this.location = location
 return this*!/
 return {
 ...this,
 location,
 }
 }

 updateForStore(changes: Partial<CanvasEntity>): UpdateStr<CanvasEntity> {
 return {
 id: this.id,
 changes,
 }
 }

 setCurrentChangesToStore(): UpdateStr<CanvasEntity> {
 return {
 id: this.id,
 changes: {
 ...this,
 },
 }
 }
 }*/

export const SizeByType = {
  [ENTITY_TYPE.Panel]: { width: 18, height: 23 },
}

/*

 export const CanvasEntity = {
 create: (location: XyLocation): CanvasEntity => ({
 id:       newGuid(),
 type:     ENTITY_TYPE.Panel,
 location,
 width:    18,
 height:   23,
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
 } as const*/