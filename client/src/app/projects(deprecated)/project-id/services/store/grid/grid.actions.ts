import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { GridMode } from './grid-mode.model'
import { TypeModel } from '../../../../models/type.model'

export enum CreateMode {
  PANEL = 'PANEL',
  CABLE = 'CABLE',
  INVERTER = 'INVERTER',
}

export const GridStateActions = createActionGroup({
  source: 'Grid Service',
  events: {
    'Select Create Mode': props<{ create: TypeModel }>(),
    'Select GridMode Create': props<{ mode: GridMode.CREATE }>(),
    'Select GridMode Delete': props<{ mode: GridMode.DELETE }>(),
    'Select GridMode Join': props<{ mode: GridMode.LINK }>(),
    'Change GridMode': props<{ mode: GridMode }>(),
    'Clear Grid State': emptyProps(),
  },
})