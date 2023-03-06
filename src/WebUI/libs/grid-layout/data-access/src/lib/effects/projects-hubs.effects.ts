import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map } from 'rxjs/operators'
import { ProjectsHubActions } from '../store/projects-hub'
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
        map(({ request }) =>
          this.logger.debug({
            source: 'ProjectsHubsEffects',
            objects: ['onSendSignalRRequest', request],
          }),
        ),
      ),
    { dispatch: false },
  )
}
