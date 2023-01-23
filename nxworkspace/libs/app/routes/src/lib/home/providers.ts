import { importProvidersFrom } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar'


export const homeProviders = [
  importProvidersFrom(MatDialogModule, MatSnackBarModule, MatSnackBarRef),
  /*  provideState(NOTIFICATIONS_FEATURE_KEY, notificationsReducer),
    provideEffects([NotificationsEffects]),*/
  /*  provideState(PROJECTS_FEATURE_KEY, projectsReducer),
    provideEffects([ProjectsEffects]),*/
]
