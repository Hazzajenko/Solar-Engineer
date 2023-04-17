import { AngleRadians, CanvasString } from '@design-app/feature-design-canvas';
import { TypeOfEntity } from '@design-app/feature-selected';
import { Point } from '@shared/data-access/models';


/*export type CanvasClientState = {
 hoveringEntityId: string | undefined
 selectedStringId: string | undefined
 singleSelectedId: string | undefined
 multiSelectedIds: string[]
 singleToRotateEntity: EntityRotation | undefined
 multiToRotateEntities: EntityLocation[]
 singleToMoveEntity: EntityLocation | undefined
 multiToMoveEntities: EntityLocation[]
 }*/

export type CanvasClientState = {
  hover: HoveringEntityState
  selected: SelectedState
  toRotate: ToRotateState
  toMove: ToMoveState
}

export type ClientStateUpdate = Partial<CanvasClientState>

export type ClientStateUpdateFn = (state: CanvasClientState) => ClientStateUpdate

export type ClientState<TEntity> = {
  ids: string[]
  entities: {
    [id: string]: TEntity
  }
}

export type SelectedEntity = TypeOfEntity

export type SelectedState = ClientState<SelectedEntity> & {
  selectedStringId: string | undefined
  singleSelectedId: TypeOfEntity | undefined
}

export type MultiSelectedState = ClientState<SelectedEntity>

export type SingleSelectedState = SelectedEntity | undefined

export type HoveringEntityState = TypeOfEntity | undefined

export type SelectedStringState = CanvasString['id'] | undefined

export type ToRepositionEntity = TypeOfEntity & {
  location: Point
  angle: AngleRadians
}

export type MultiToRotateState = ClientState<ToRepositionEntity>

export type SingleToRotateState = ToRepositionEntity | undefined

export type ToRotateState = ClientState<ToRepositionEntity> & {
  singleToRotateEntity: ToRepositionEntity | undefined
}

export type MultiToMoveState = ClientState<ToRepositionEntity>

export type SingleToMoveState = ToRepositionEntity | undefined

export type ToMoveState = ClientState<ToRepositionEntity> & {
  singleToMoveEntity: ToRepositionEntity | undefined
}

export const initialClientTState = <TState>() => {
  return {
    ids: [],
    entities: {},
  } as TState
}

// two.

// /*
//
// /*export type EntityPosition = {
//   id: string
//   type: EntityType
//   location: Point
//   rotation: number
// }
//
// export type EntityLocation = Omit<EntityPosition, 'rotation'>
//