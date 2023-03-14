import { ClientXY, GridLayoutXY, MouseXY, PosXY } from '../..'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { WindowSizeModel } from '@shared/data-access/models'

export const UiActions = createActionGroup({
  source: 'Ui Store',
  events: {
    'Toggle Keymap': emptyProps(),
    'Toggle Path Lines': emptyProps(),
    'Toggle String Statistics': emptyProps(),
    'Toggle Create Project Overlay': emptyProps(),
    'Set ClientXY': props<{ clientXY: ClientXY }>(),
    'Clear ClientXY': emptyProps(),
    'Set GridLayout Component XY': props<{ gridLayoutXY: GridLayoutXY }>(),
    'Stop GridLayout Moving': emptyProps(),
    'Reset GridLayout Component XY': emptyProps(),
    'Set Pos XY': props<{ posXY: PosXY }>(),
    'Reset Pos XY': emptyProps(),
    'Set Mouse XY': props<{ mouseXY: MouseXY }>(),
    'Reset Mouse XY': emptyProps(),
    'Set Scale': props<{ scale: number }>(),
    'Key Pressed': props<{ key: string }>(),
    'Toggle NavMenu': emptyProps(),
    'Set GridLayout Zoom': props<{ zoom: number }>(),
    'Reset GridLayout Zoom': emptyProps(),
    'Set Window Size': props<{ windowSize: WindowSizeModel }>(),
  },
})
