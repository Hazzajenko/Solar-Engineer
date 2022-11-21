import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { StringModel } from '../../models/string.model'
import { GridMode } from './grid-mode.model'
import { UnitModel } from '../../models/unit.model'

/*export const selectStringForGrid = createAction(
  '[Grid Service] Select String For Grid',
  props<{ string: StringModel }>(),
)

export const selectTrackerStringsForGrid = createAction(
  '[Grid Service] Select Tracker Strings For Grid',
  props<{ strings: StringModel[] }>(),
)

export const selectInverterStringsForGrid = createAction(
  '[Grid Service] Select Inverter Strings For Grid',
  props<{ strings: StringModel[] }>(),
)*/

/*
export const clearGridState = createAction('[Grid Service] Clear Grid State')*/

export enum CreateMode {
  PANEL = 'PANEL',
  CABLE = 'CABLE',
  INVERTER = 'INVERTER',
}

export const GridStateActions = createActionGroup({
  source: 'Grid Service',
  events: {
    'Select String For Grid': props<{ string: StringModel }>(),
    'Select Tracker Strings For Grid': props<{ strings: StringModel[] }>(),
    'Select Inverter Strings For Grid': props<{ strings: StringModel[] }>(),
    // 'Select Panel Create Mode': props<{ mode: CreateMode }>(),
    'Select Create Mode': props<{ create: UnitModel }>(),
    'Select GridMode Create': props<{ mode: GridMode.CREATE }>(),
    'Select GridMode Delete': props<{ mode: GridMode.DELETE }>(),
    'Select GridMode Join': props<{ mode: GridMode.JOIN }>(),
    'Change GridMode': props<{ mode: GridMode }>(),
    'Add To Join Array': props<{ toJoin: string }>(),
    'Start Join': props<{ toJoin: string }>(),
    'Clear Join Array': emptyProps(),
    'Clear Grid State': emptyProps(),
  },
})
