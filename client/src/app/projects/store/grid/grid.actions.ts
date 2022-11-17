import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { StringModel } from '../../models/string.model'

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
}

export type CreateString = 'Panel' | 'Cable'

export const GridStateActions = createActionGroup({
  source: 'Grid Service',
  events: {
    'Select String For Grid': props<{ string: StringModel }>(),
    'Select Tracker Strings For Grid': props<{ strings: StringModel[] }>(),
    'Select Inverter Strings For Grid': props<{ strings: StringModel[] }>(),
    'Select Panel Create Mode': props<{ mode: CreateMode }>(),
    'Select Cable Create Mode': props<{ mode: CreateMode }>(),
    'Clear Grid State': emptyProps(),
  },
})
