import { importProvidersFrom } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar'
import { provideEffects } from '@ngrx/effects'
import { provideState } from '@ngrx/store'
import { PROJECTS_FEATURE_KEY, projectsReducer } from '@projects/data-access/store'
import { ProjectsEffects } from '@projects/data-access/effects'

export const homeProviders = [
  importProvidersFrom(MatDialogModule, MatSnackBarModule, MatSnackBarRef),
  provideState(PROJECTS_FEATURE_KEY, projectsReducer),
  provideEffects([ProjectsEffects]),
]
