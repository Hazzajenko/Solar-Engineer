/*

export const ProjectsHubActions = createActionGroup({
  source: 'Projects Hub Store',
  events: {
    'Send SignalR Request': props<{ projectSignalrEvent: ProjectSignalrEvent }>(),
    'Update SignalR Request': props<{ update: Update<ProjectSignalrEvent> }>(),
    'Update Many SignalR Requests': props<{ updates: Update<ProjectSignalrEvent>[] }>(),
    'Receive SignalR Event': props<{ projectSignalrEvent: ProjectSignalrEvent }>(),
    'Receive Many SignalR Events': props<{ projectSignalrEvents: ProjectSignalrEvent[] }>(),
    'Cancel SignalR Request': emptyProps(),
  },
})
// ProjectsHubActions.

export function createActionGroupV2<
  Source extends string,
  Events extends Record<string, ActionCreatorProps<unknown> | Creator>,
>(config: ActionGroupConfig<Source, Events>): ActionGroup<Source, Events>

const rec: Record<string, ActionCreatorProps<unknown> | Creator> = {
  'Cancel SignalR Request': emptyProps(),
}
createActionGroupV2({
  source: 'Projects Hub Store',
  events: rec
})
export function CreateNgrxActionGroupV2<
  Source extends string,
  Events extends Record<string, ActionCreatorProps<unknown> | Creator>,
>(source2: Source, events2: Events[]) {
  const config: ActionGroupConfig<Source, Events> = {
    source: 'Projects Hub Store',
    events: {

    }

  }
/!*  return createActionGroup({
    source,
    /!*    events: events.reduce((acc, event) => {
          acc[event] = emptyProps()
          return acc
        }, {}),*!/
  })*!/
}

export function CreateNgrxActionGroup<T extends string>(source2: string, events: T[]) {
  return createActionGroup({
    source: source2,
    /!*    events: events.reduce((acc, event) => {
          acc[event] = emptyProps()
          return acc
        }, {}),*!/
  })
}
*/
