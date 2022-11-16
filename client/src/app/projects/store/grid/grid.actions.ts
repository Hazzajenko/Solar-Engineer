import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { StringModel } from '../../models/string.model'
import { BlockModel } from '../../models/block.model'
import { Update } from '@ngrx/entity'

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
    'Add Block For Grid': props<{ block: BlockModel }>(),
    'Add Many Blocks For Grid': props<{ blocks: BlockModel[] }>(),
    'Update Block For Grid': props<{ block: BlockModel }>(),
    'Update Many Blocks For Grid': props<{ blocks: Update<BlockModel>[] }>(),
    'Delete Block For Grid': props<{ block: BlockModel }>(),
    'Clear Grid State': emptyProps(),
  },
})
