import { ProjectsEffects } from '@projects/data-access'
import {
  LinksEffects,
  PanelsEffects,
  PathsEffects,
  SelectedEffects,
  StringsEffects,
} from '@grid-layout/data-access'
import { SignalrEventsEffects } from '@app/data-access/signalr'

export const projectsEffects = [
  ProjectsEffects,
  PanelsEffects,
  StringsEffects,
  LinksEffects /*
    BlocksEffects,
    EntitiesEffects,*/,
  SelectedEffects,
  PathsEffects,
  SignalrEventsEffects,
  // ProjectsHubsEffects,
]
