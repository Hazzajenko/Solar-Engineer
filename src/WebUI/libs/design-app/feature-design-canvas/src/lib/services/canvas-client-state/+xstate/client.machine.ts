import {
  DragBoxState,
  GridState,
  HoveringEntityState,
  InitialSelectedState,
  MenuState,
  ModeState,
  MouseState,
  NearbyState,
  SelectedState,
  ToMoveState,
  ToRotateState,
  ViewState,
} from '../types'
import { getActionFromAnyEventObject } from './machine-actions.types'
import { CanvasAppMachineEvent } from './machine-event.types'
import { createMachine } from 'xstate'

export type CanvasAppMachineContext = {
  hover: HoveringEntityState
  selected: SelectedState
  toRotate: ToRotateState
  toMove: ToMoveState
  dragBox: DragBoxState
  mode: ModeState
  view: ViewState
  mouse: MouseState
  menu: MenuState
  nearby: NearbyState
  grid: GridState
}

/*export type PickedCanvasAppMachineContext = Pick<
 CanvasAppMachineContext,
 'dragBox' | 'selected' | 'hover'
 >*/
export type PickedCanvasAppMachineContext = Pick<CanvasAppMachineContext, 'selected'>

/*  | {
 type: 'Set Drag Box'
 payload: {
 dragBox: DragBoxState
 }
 }*/

export const canvasAppMachine = createMachine<PickedCanvasAppMachineContext>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGECGA7Abq2BBADvgHQDKYANmAMYAukABCTanQMRrpUWMXV0QBtAAwBdRKHwB7WAEsaMyenEgAHogDsAJgA0IAJ6IAzAE4hRACybjANgAc6gKwBfJ7o7Y8hUr1oMmLMCIAUXR5Gj0eSl8IdnIZKgBreiDyWDAAdwALMAAnMGExJBApWXlFZTUEEwciIWNDR10DBE1zayJjB0MARk1nVxB3HAJiMij+RmY6YNC5CLG+SFj4hIYAeXR6ABEZADNd3LBQ5NnwguUSuQUlIsru83MiRv1EbutuonvDTSs363--sYXG4MB4Rt5xn4poEAHKKMCRRYxZBxRL0DYnMJ6c5FS5lG6gSrVWr1Z7NboObrAwag4ZeBbRSYBIhw9AIhn8Vj+HI0RG0a70ABCkhUOIk0iu5VuGgcZks3XsDiaiD66iIXWs5gctkMur1DWpQ08ox8E380w5DGFKiZPPoAAVJDJjmQaFzTQwALIAV3I8nwlExVzgYuKEvxFVerXalIc1j6ypalI6XV6-RBWDpJshECZFo9uettt5judvNd7vGAqLHC45EoglEF3D10jCEccs0CrJr3e6p1+sHhnMhtpxohSLzgR9fpkAYRITCMjgfM5uAgucXc3oABVJPQZ-7A5bG4VxaVW9KEPdTBYu4rEwqPuZ1NY430XAN0JIIHBlEaRmbC8pUJRAAFpWkTCCRwGAD6QLKcgMlAlVBVcxE2sQx1VHTNxxPKcZixVdICQiMr27DorDsHsWnjElMIccw-gBdQcLBeCcwI1l2QLUjL1AhBtRqBolReFotCIax1BsRU2KzCdGXNQJ8KLbkSydF0wBoPiQNQhBjFsWx1XUWw00TTRHE+aTqPTGlcPBfClKIQ850DLd5BXE8dJQu5KSw951G7UTmk0WxNDvGTHE-JwgA */
    // tsTypes: {} as import('./client.machine.typegen').Typegen0,
    id: 'CanvasApp',
    context: {
      selected: InitialSelectedState,
      // hover: InitialHoveringEntityState,
      // dragBox: InitialDragBoxState,
    },
    states: {
      'Selected State': {
        initial: 'Entity Selected',
        states: {
          'Entity Selected': {
            on: {
              'Click Elsewhere': {
                target: 'None Selected',
                actions: 'Clear Selected',
              },
              'Clicked On Different Entity': {
                actions: 'Set Selected Entity',
              },
            },
          },
          'None Selected': {
            on: {
              'Click On Entity': {
                target: 'Entity Selected',
                actions: 'Set Selected Entity',
              },
              'Start Selection Box': {
                target: 'Selected Box Start Point Set',
                actions: 'Set Selection Box Start',
              },
            },
          },
          'Selected Box Start Point Set': {
            on: {
              'Selected Multiple Entities': {
                target: 'Multiple Entities Selected',
                actions: 'Set Multiple Selected Entities',
              },
              'Selection Box Cancelled': {
                target: 'None Selected',
                actions: 'Clear Selection Box Start',
              },
            },
          },
          'Multiple Entities Selected': {
            on: {
              'Add Entity To Multiple Selected': {
                actions: 'Add Entity To Multiple Selected',
              },
            },
          },
        },
        on: {
          'Cancel Selected': {
            target: '.None Selected',
            cond: 'Selected Is Defined',
            actions: 'Clear Selected',
          },
        },
      },
    },
    type: 'parallel',
    schema: {
      events: {} as CanvasAppMachineEvent,
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      ClearSelected: (ctx) => {
        return (ctx.selected = InitialSelectedState)
      },
      SetSelectedEntity: (ctx, event) => {
        const action = getActionFromAnyEventObject(event, 'SetSelectedEntity')
        if (!action) return
        const payload = action.payload
        return (ctx.selected = {
          ...ctx.selected,
          singleSelectedId: payload.id,
          multipleSelectedIds: [],
          selectedStringId: undefined,
        })
      },
      SetMultipleSelectedEntities: (ctx, event) => {
        if (ctx.selected.singleSelectedId) {
          return (ctx.selected = {
            ...ctx.selected,
            multipleSelectedIds: [ctx.selected.singleSelectedId, event['value']],
            singleSelectedId: undefined,
          })
        }
        return (ctx.selected = {
          ...ctx.selected,
          multipleSelectedIds: event['value'],
          singleSelectedId: undefined,
        })
      },
      AddEntityToMultipleSelected: (ctx, event) => {
        const payload = event['payload']
        return (ctx.selected = {
          ...ctx.selected,
          multipleSelectedIds: [...ctx.selected.multipleSelectedIds, event['value']],
        })
      },

      /*       SetSelectionBoxStart: (ctx) => {},
       SetMultipleSelectedEntities: (ctx) => {},
       ClearSelectionBoxStart: (ctx) => {},
       AddEntityToMultipleSelected: (ctx) => {}, */
    },
  },
)

/*
 const getPayload = (eventName: CanvasAppMachineEventType) => {
 return event['value']
 }*/