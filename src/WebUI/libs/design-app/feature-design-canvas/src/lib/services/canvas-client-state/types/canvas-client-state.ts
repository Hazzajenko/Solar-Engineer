import { AngleRadians } from '../../../utils'
import { DragBoxState } from './drag-box'
import { HoveringEntityState } from './hovering'
import { ModeState } from './mode'
import { SelectedState } from './selected'
import { ToMoveState } from './to-move'
import { ToRotateState } from './to-rotate'
import { ViewState } from './view'
import { TypeOfEntity } from '@design-app/feature-selected'
import { Point } from '@shared/data-access/models'


export type CanvasClientState = {
  hover: HoveringEntityState
  selected: SelectedState
  toRotate: ToRotateState
  toMove: ToMoveState
  dragBox: DragBoxState
  mode: ModeState
  view: ViewState
}

export type CanvasClientStateUpdate = {
  [P in keyof CanvasClientState]?: CanvasClientState[P]
}

export type CanvasClientStateUpdatePartial = {
  [P in keyof CanvasClientState]?: Partial<CanvasClientState[P]>
}

// export type ClientStateUpdate = Partial<CanvasClientState>

export type ClientState<TEntity> = {
  ids: string[]
  entities: {
    [id: string]: TEntity
  }
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