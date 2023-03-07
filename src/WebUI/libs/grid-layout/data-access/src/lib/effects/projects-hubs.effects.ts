import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map } from 'rxjs/operators'
import { ProjectsHubActions } from '../store'
import { LoggerService } from '@shared/logger'

@Injectable({
  providedIn: 'root',
})
export class ProjectsHubsEffects {
  private actions$ = inject(Actions)
  private logger = inject(LoggerService)

  onSendSignalRRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProjectsHubActions.sendSignalrRequest),
        map(({ signalrRequest }) =>
          this.logger.debug({
            source: 'ProjectsHubsEffects',
            objects: ['onSendSignalRRequest', signalrRequest],
          }),
        ),
      ),
    { dispatch: false },
  )
}
