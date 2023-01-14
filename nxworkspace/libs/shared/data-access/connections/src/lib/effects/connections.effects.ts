import { inject, Injectable } from '@angular/core'
import { AuthActions } from '@auth/data-access/store'
import { tapResponse } from '@ngrx/component-store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { PanelsService } from '@project-id/data-access/api'
import { BlocksActions, PanelsActions } from '@project-id/data-access/store'
import { ProjectsFacade, ProjectsStoreService } from '@projects/data-access/facades'
import { ProjectsActions } from '@projects/data-access/store'
import { ConnectionsService } from '@shared/data-access/connections'
import { PanelModel } from '@shared/data-access/models'
import { combineLatestWith, of, switchMap } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class ConnectionsEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)

  // private panelsService = inject(PathsService)
  // private projectsFacade = inject(ProjectsFacade)
  private projectsStore = inject(ProjectsStoreService)
  private connectionsService = inject(ConnectionsService)
  initConnections$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signInSuccess),
        map(({ token }) =>
          this.connectionsService.createHubConnection(token),
        ),
      ),
    { dispatch: false },
  )
}
