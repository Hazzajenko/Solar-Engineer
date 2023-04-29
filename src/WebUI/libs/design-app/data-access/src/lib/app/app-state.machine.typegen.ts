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
    ClearDragBox: 'StopDragBox'
    ClearHoveredEntity: 'PointerLeaveEntity'
    ClearSelectionBoxStart: 'SelectionBoxCancelled' | 'SelectionBoxCompleted'
    SetHoveredEntity: 'PointerHoverOverEntity'
    SetMultipleMove: 'StartMultipleMove'
    SetMultipleRotate: 'StartMultipleRotate'
    SetMultipleSelectedEntities: 'SelectionBoxCompleted'
    SetPointerDown: 'PointerDown'
    SetPointerUp: 'PointerUp'
    SetSingleMove: 'StartSingleMove'
    SetSingleRotate: 'StartSingleRotate'
    SetSingleRotateMode: 'StartSingleRotateMode'
    SetViewDragging: 'StartViewDragging'
    StopMultipleMove: 'StopMultipleMove'
    StopMultipleRotate: 'StopMultipleRotate'
    StopSingleMove: 'StopSingleMove'
    StopSingleRotate: 'StopSingleRotate'
    StopSingleRotateMode: 'StopSingleRotate' | 'StopSingleRotateMode'
    StopViewDragging: 'StopViewDragging'
  }
  eventsCausingDelays: {}
  eventsCausingGuards: {}
  eventsCausingServices: {}
  matchesStates:
    | 'DragBoxState'
    | 'DragBoxState.CreationBoxInProgress'
    | 'DragBoxState.NoDragBox'
    | 'DragBoxState.SelectionBoxInProgress'
    | 'GridState'
    | 'GridState.ModeState'
    | 'GridState.ModeState.CreateMode'
    | 'GridState.ModeState.SelectMode'
    | 'GridState.PreviewAxisState'
    | 'GridState.PreviewAxisState.AxisCreatePreviewInProgress'
    | 'GridState.PreviewAxisState.AxisRepositionPreviewInProgress'
    | 'GridState.PreviewAxisState.None'
    | 'PointerState'
    | 'PointerState.HoveringOverEntity'
    | 'PointerState.PointerIsDown'
    | 'PointerState.PointerUp'
    | 'ToMoveState'
    | 'ToMoveState.MultipleMoveInProgress'
    | 'ToMoveState.NoMove'
    | 'ToMoveState.SingleMoveInProgress'
    | 'ToRotateState'
    | 'ToRotateState.MultipleRotateInProgress'
    | 'ToRotateState.NoRotate'
    | 'ToRotateState.SingleRotateInProgress'
    | 'ToRotateState.SingleRotateModeInProgress'
    | 'ViewState'
    | 'ViewState.ContextMenuState'
    | 'ViewState.ContextMenuState.ContextMenuOpen'
    | 'ViewState.ContextMenuState.NoContextMenu'
    | 'ViewState.ViewPositioningState'
    | 'ViewState.ViewPositioningState.ViewDraggingInProgress'
    | 'ViewState.ViewPositioningState.ViewNotMoving'
    | {
        DragBoxState?: 'CreationBoxInProgress' | 'NoDragBox' | 'SelectionBoxInProgress'
        GridState?:
          | 'ModeState'
          | 'PreviewAxisState'
          | {
              ModeState?: 'CreateMode' | 'SelectMode'
              PreviewAxisState?:
                | 'AxisCreatePreviewInProgress'
                | 'AxisRepositionPreviewInProgress'
                | 'None'
            }
        PointerState?: 'HoveringOverEntity' | 'PointerIsDown' | 'PointerUp'
        ToMoveState?: 'MultipleMoveInProgress' | 'NoMove' | 'SingleMoveInProgress'
        ToRotateState?:
          | 'MultipleRotateInProgress'
          | 'NoRotate'
          | 'SingleRotateInProgress'
          | 'SingleRotateModeInProgress'
        ViewState?:
          | 'ContextMenuState'
          | 'ViewPositioningState'
          | {
              ContextMenuState?: 'ContextMenuOpen' | 'NoContextMenu'
              ViewPositioningState?: 'ViewDraggingInProgress' | 'ViewNotMoving'
            }
      }
  tags: never
}
