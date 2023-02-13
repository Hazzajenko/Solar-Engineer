import { importProvidersFrom } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar'
import { provideEffects } from '@ngrx/effects'
import { provideState } from '@ngrx/store'
import {
  NOTIFICATIONS_FEATURE_KEY,
  NotificationsEffects,
  notificationsReducer,
} from '@shared/data-access/notifications'

export const homeProviders = [
  importProvidersFrom(MatDialogModule, MatSnackBarModule, MatSnackBarRef),
  /*  provideState(NOTIFICATIONS_FEATURE_KEY, notificationsReducer),
    provideEffects([NotificationsEffects]),*/
  /*  provideState(PROJECTS_FEATURE_KEY, projectsReducer),
    provideEffects([ProjectsEffects]),*/
]
