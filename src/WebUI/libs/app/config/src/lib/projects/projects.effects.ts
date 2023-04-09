import { GridPanelsEffects, GridSelectedEffects, GridStringsEffects, LinksEffects, PathsEffects } from '@grid-layout/data-access';
import { ProjectsEffects, SignalrEventsEffects } from '@projects/data-access';


// import { SignalrEventsEffects } from '@app/data-access/signalr'

export const projectsEffects = [
  ProjectsEffects,
  GridPanelsEffects,
  GridStringsEffects,
  LinksEffects /*
   BlocksEffects,
   EntitiesEffects,*/,
  GridSelectedEffects,
  PathsEffects,
  SignalrEventsEffects,
  // ProjectsHubsEffects,
]