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
    ClearDragBox: 'StopDragBox'
    ClearHoveredEntity: 'PointerLeaveEntity'
    ClearSelected: 'CancelSelected' | 'ClearEntitySelected'
    ClearSelectionBoxStart: 'SelectionBoxCancelled' | 'SelectionBoxCompleted'
    RemoveEntitiesFromMultipleSelected: 'RemoveEntitiesFromMultipleSelected'
    SetHoveredEntity: 'PointerHoverOverEntity'
    SetMultipleMove: 'StartMultipleMove'
    SetMultipleRotate: 'StartMultipleRotate'
    SetMultipleSelectedEntities: 'SelectionBoxCompleted'
    SetPointerDown: 'PointerDown'
    SetPointerUp: 'PointerUp'
    SetSelectedEntity: 'SelectedDifferentEntity' | 'SelectedSingleEntity'
    SetSelectionBoxStart: 'StartSelectionBox'
    SetSingleMove: 'StartSingleMove'
    SetSingleRotate: 'StartSingleRotate'
    SetSingleRotateMode: 'StartSingleRotateMode'
    StopMultipleMove: 'StopMultipleMove'
    StopMultipleRotate: 'StopMultipleRotate'
    StopSingleMove: 'StopSingleMove'
    StopSingleRotate: 'StopSingleRotate'
    StopSingleRotateMode: 'StopSingleRotate' | 'StopSingleRotateMode'
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
    | 'ToRotateState'
    | 'ToRotateState.MultipleRotateInProgress'
    | 'ToRotateState.NoRotate'
    | 'ToRotateState.SingleRotateInProgress'
    | 'ToRotateState.SingleRotateModeInProgress'
    | {
        DragBoxState?: 'DragBoxInProgress' | 'NoDragBox'
        PointerState?: 'HoveringOverEntity' | 'PointerIsDown' | 'PointerUp'
        SelectedState?: 'EntitySelected' | 'MultipleEntitiesSelected' | 'NoneSelected'
        ToMoveState?: 'MultipleMoveInProgress' | 'NoMove' | 'SingleMoveInProgress'
        ToRotateState?:
          | 'MultipleRotateInProgress'
          | 'NoRotate'
          | 'SingleRotateInProgress'
          | 'SingleRotateModeInProgress'
      }
  tags: never
}
