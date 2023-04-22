import { AngleRadians } from '../../../utils'
import { DragBoxState } from './drag-box'
import { HoveringEntityState } from './hovering'
import { MenuState } from './menu'
import { ModeState } from './mode'
import { MouseState } from './mouse'
import { NearbyState } from './nearby-entites'
import { SelectedState } from './selected'
import { ToMoveState } from './to-move'
import { ToRotateState } from './to-rotate'
import { ViewState } from './view'
import { TypeOfEntity } from '@design-app/feature-selected'
import { Dictionary } from '@ngrx/entity/src/models'
import { Point } from '@shared/data-access/models'


export type CanvasClientState = {
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
}
export type StateUpdate = {
  [P in keyof CanvasClientState]?: Partial<CanvasClientState[P]>
}

// export type StateUpdate = DeepPartial<CanvasClientState>

export type StateUpdateFn = (state: CanvasClientState) => StateUpdate

// export type ClientStateUpdate = Partial<CanvasClientState>

export type ClientState<TEntity> = {
  ids: string[]
  entities: {
    [id: string]: TEntity
  }
}

export type EntityStateStr<T> = {
  ids: string[]
  entities: Dictionary<T>
}

export type ToRepositionEntity = TypeOfEntity & {
  location: Point
  angle: AngleRadians
}

/*
 export const initialClientTState = <TState>() => {
 return {
 ids: [],
 entities: {},
 } as TState
 }*/

export const updateStateV2 = (state: CanvasClientState, changes: StateUpdate) => {
  const newState = {
    ...state,
  }
  if (changes.hover !== undefined) {
    newState.hover = {
      ...state.hover,
      ...changes.hover,
    }
  }
  if (changes.selected !== undefined) {
    newState.selected = {
      ...state.selected,
      ...changes.selected,
    }
    console.log('selected', changes.selected)
  }

  if (changes.toRotate !== undefined) {
    newState.toRotate = {
      ...state.toRotate,
      ...changes.toRotate,
    }
  }
  if (changes.toMove !== undefined) {
    newState.toMove = {
      ...state.toMove,
      ...changes.toMove,
    }
  }
  if (changes.dragBox !== undefined) {
    newState.dragBox = {
      ...state.dragBox,
      ...changes.dragBox,
    }
    console.log('dragBox', newState.dragBox)
  }
  if (changes.mode !== undefined) {
    newState.mode = {
      ...state.mode,
      ...changes.mode,
    }
  }
  if (changes.view !== undefined) {
    newState.view = {
      ...state.view,
      ...changes.view,
    }
  }
  if (changes.mouse !== undefined) {
    newState.mouse = {
      ...state.mouse,
      ...changes.mouse,
    }
  }

  if (changes.menu !== undefined) {
    newState.menu = {
      ...state.menu,
      ...changes.menu,
    }
    console.log('menu', newState.menu)
  }
  return newState
}

export const updateStateV3 = (state: CanvasClientState, changes: StateUpdate) => {
  const newState = {
    ...state,
  }

  Object.keys(changes).forEach((key) => {
    // console.log(changes[key as keyof CanvasClientStateUpdatePartial])

    const value = changes[key as keyof StateUpdate]
    if (typeof value !== 'undefined') {
      if ((state as any)[key] === value && (typeof value !== 'object' || value === null)) {
        return
      }
    }

    if (value !== undefined) {
      (newState as any)[key as keyof CanvasClientState] = {
        ...state[key as keyof CanvasClientState],
        ...changes[key as keyof StateUpdate],
      }
      /*     (newState as any)[key] = {
         ...(state as any)[key],
         ...value,
         }*/
    }
    /*    if (changes[key as keyof CanvasClientStateUpdatePartial] !== undefined) {
       newState[key as keyof CanvasClientState] = {
       ...state[key as keyof CanvasClientState],
       ...changes[key as keyof CanvasClientStateUpdatePartial],
       }
       }*/
  })

  /*  // console.log(changes)
   for (const key in changes) {
   // console.log('key', key)
   const value = (changes as any)[key]
   if (typeof value !== 'undefined') {
   if ((state as any)[key] === value && (typeof value !== 'object' || value === null)) {
   continue
   }

   (newState as any)[key] = {
   ...(state as any)[key],
   ...value,
   }
   // console.log('newState', (newState as any)[key])
   // (newState as any)[key] = value
   }
   }*/
  return newState
}

export const updateStateObject = (
  state: CanvasClientState,
  changes: StateUpdate,
): CanvasClientState => {
  // let didChange = false
  for (const key in changes) {
    const value = (changes as any)[key]
    if (typeof value !== 'undefined') {
      if ((state as any)[key] === value && (typeof value !== 'object' || value === null)) {
        continue
      }
      // didChange = true;
      (state as any)[key] = value
    }
  }

  return state

  /* if (!didChange) {
   return state
   }*/

  /*  return {
   ...state,
   ...changes,
   }*/
}