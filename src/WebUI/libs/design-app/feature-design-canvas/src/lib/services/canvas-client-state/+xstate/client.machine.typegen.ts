// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  internalEvents: {
    'xstate.init': { type: 'xstate.init' }
  }
  invokeSrcNameMap: {}
  missingImplementations: {
    actions: never
    delays: never
    guards: never
    services: never
  }
  eventsCausingActions: {
    AddEntitiesToMultipleSelected: 'AddEntitiesToMultipleSelected'
    CancelMultipleMove: 'CancelMultipleMove'
    CancelSingleMove: 'CancelSingleMove' | 'StopSingleMove'
    ClearHoveredEntity: 'PointerLeaveEntity'
    ClearSelected: 'CancelSelected' | 'ClearEntitySelected'
    ClearSelectionBoxStart: 'SelectionBoxCancelled' | 'SelectionBoxCompleted'
    MoveMultipleEntities: 'MoveMultipleEntities'
    MoveSingleEntity: 'MoveSingleEntity'
    RemoveEntitiesFromMultipleSelected: 'RemoveEntitiesFromMultipleSelected'
    SetHoveredEntity: 'PointerHoverOverEntity'
    SetMultipleMove: 'StartMultipleMove'
    SetMultipleSelectedEntities: 'SelectionBoxCompleted'
    SetPointerDown: 'PointerDown'
    SetPointerUp: 'PointerUp'
    SetSelectedEntity: 'SelectedDifferentEntity' | 'SelectedSingleEntity'
    SetSelectionBoxStart: 'StartSelectionBox'
    SetSingleMove: 'StartSingleMove'
  }
  eventsCausingDelays: {}
  eventsCausingGuards: {
    SelectedIsDefined: 'CancelSelected'
  }
  eventsCausingServices: {}
  matchesStates:
    | 'DragBoxState'
    | 'DragBoxState.DragBoxInProgress'
    | 'DragBoxState.NoDragBox'
    | 'PointerState'
    | 'PointerState.HoveringOverEntity'
    | 'PointerState.PointerIsDown'
    | 'PointerState.PointerUp'
    | 'SelectedState'
    | 'SelectedState.EntitySelected'
    | 'SelectedState.MultipleEntitiesSelected'
    | 'SelectedState.NoneSelected'
    | 'ToMoveState'
    | 'ToMoveState.MultipleMoveInProgress'
    | 'ToMoveState.NoMove'
    | 'ToMoveState.SingleMoveInProgress'
    | {
        DragBoxState?: 'DragBoxInProgress' | 'NoDragBox'
        PointerState?: 'HoveringOverEntity' | 'PointerIsDown' | 'PointerUp'
        SelectedState?: 'EntitySelected' | 'MultipleEntitiesSelected' | 'NoneSelected'
        ToMoveState?: 'MultipleMoveInProgress' | 'NoMove' | 'SingleMoveInProgress'
      }
  tags: never
}
