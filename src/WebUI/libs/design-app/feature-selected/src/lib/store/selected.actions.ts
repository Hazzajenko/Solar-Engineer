import { TypeOfEntity } from '../types'
import { NearbyEntityOnAxis } from '../types/nearby-entity-on-axis'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Point } from '@shared/data-access/models'

export const SelectedActions = createActionGroup({
  source: 'Selected Store',
  events: {
    'Select Entity': props<{
      entity: TypeOfEntity
    }>(),
    'Select Multiple Entities': props<{
      entities: TypeOfEntity[]
    }>(),
    'Select String': props<{
      stringId: string
    }>(),
    'Start MultiSelect': props<{
      entity: TypeOfEntity
    }>(),
    'Add Entity To MultiSelect': props<{
      entity: TypeOfEntity
    }>(),
    'Add Nearby Entity On Axis': props<{
      entity: NearbyEntityOnAxis
    }>(),
    'Add Many Nearby Entities On Axis': props<{
      entities: NearbyEntityOnAxis[]
    }>(),
    'Clear Nearby Entities On Axis': emptyProps(),
    'Start Multi Selection Box': props<{
      point: Point
    }>(),
    'Stop Multi Selection Box': props<{
      entities: TypeOfEntity[]
    }>(),
    'Cancel Multi Selection Box': emptyProps(),
    'Clear Single Selected': emptyProps(),
    'Clear Multi Selected': emptyProps(),
    'Clear Selected State': emptyProps(),
  },
})