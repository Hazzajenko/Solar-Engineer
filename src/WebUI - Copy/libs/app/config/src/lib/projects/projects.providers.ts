import { importProvidersFrom } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar'
import { provideEffects } from '@ngrx/effects'
// import { PROJECTS_FEATURE_KEY, ProjectsEffects, projectsReducer } from '@projects/data-access'
import { projectsStates } from './projects.states'
import { projectsEffects } from './projects.effects'

export const projectsProviders = [
  importProvidersFrom(MatDialogModule, MatSnackBarModule, MatSnackBarRef),
  /*  provideState(PROJECTS_HUB_FEATURE_KEY, projectsHubReducer),
    provideState(PROJECTS_FEATURE_KEY, projectsReducer),
    provideState(PANELS_FEATURE_KEY, panelsReducer),
    provideState(STRINGS_FEATURE_KEY, stringsReducer),
    provideState(LINKS_FEATURE_KEY, linksReducer),
    provideState(BLOCKS_FEATURE_KEY, blocksReducer),
    provideState(ENTITIES_FEATURE_KEY, entitiesReducer),
    provideState(SELECTED_FEATURE_KEY, selectedReducer),
    provideState(GRID_FEATURE_KEY, gridReducer),
    provideState(MULTI_FEATURE_KEY, multiReducer),
    provideState(UI_FEATURE_KEY, uiReducer),
    provideState(PATHS_FEATURE_KEY, pathsReducer),*/
  ...projectsStates,
  provideEffects([
    ...projectsEffects,
    /*    ProjectsEffects,
        PanelsEffects,
        StringsEffects,
        LinksEffects /!*
        BlocksEffects,
        EntitiesEffects,*!/,
        SelectedEffects,
        PathsEffects,
        ProjectsHubsEffects,*/
  ]),
]
