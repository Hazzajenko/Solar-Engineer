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
  eventsCausingActions: {}
  eventsCausingDelays: {}
  eventsCausingGuards: {}
  eventsCausingServices: {}
  matchesStates:
    | 'CreatePreviewState'
    | 'CreatePreviewState.CreatePreviewDisabled'
    | 'CreatePreviewState.CreatePreviewEnabled'
    | 'NearbyLinesState'
    | 'NearbyLinesState.NearbyLinesDisabled'
    | 'NearbyLinesState.NearbyLinesEnabled'
    | 'NearbyLinesState.NearbyLinesEnabled.CenterLineBetweenTwoEntities'
    | 'NearbyLinesState.NearbyLinesEnabled.CenterLineScreenSize'
    | 'NearbyLinesState.NearbyLinesEnabled.TwoSideAxisLines'
    | {
        CreatePreviewState?: 'CreatePreviewDisabled' | 'CreatePreviewEnabled'
        NearbyLinesState?:
          | 'NearbyLinesDisabled'
          | 'NearbyLinesEnabled'
          | {
              NearbyLinesEnabled?:
                | 'CenterLineBetweenTwoEntities'
                | 'CenterLineScreenSize'
                | 'TwoSideAxisLines'
            }
      }
  tags: never
}
