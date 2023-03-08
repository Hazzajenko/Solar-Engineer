import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map } from 'rxjs/operators'
import { ProjectsHubActions, ProjectsHubSelectors } from '../store'
import { LoggerService } from '@shared/logger'
import { ProjectsHubRepository } from '../services'
import { Store } from '@ngrx/store'
import { Update } from '@ngrx/entity'
import { ProjectSignalrEvent } from '@shared/data-access/models'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ProjectsHubsEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)
  private logger = inject(LoggerService)
  private projectsHubRepository = inject(ProjectsHubRepository)

  onSendSignalRRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProjectsHubActions.sendSignalrRequest),
        map(({ projectSignalrEvent }) =>
          this.logger.debug({
            source: 'ProjectsHubsEffects',
            objects: ['onSendSignalRRequest', projectSignalrEvent],
          }),
        ),
      ),
    { dispatch: false },
  )

  onReceiveManySignalREvents = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProjectsHubActions.receiveManySignalrEvents),
        map(async ({ projectSignalrEvents }) => {
          this.logger.debug({
            source: 'ProjectsHubsEffects',
            objects: ['onReceiveManySignalREvents', projectSignalrEvents],
          })
          for (const event of projectSignalrEvents) {
            if (!event.isSuccess || event.error) {
              this.logger.error({
                source: 'ProjectsHubsEffects',
                objects: ['onReceiveManySignalREvents', 'event is not success', event],
              })
              continue
            }
            const eventInStore = await firstValueFrom(
              this.store.select(
                ProjectsHubSelectors.selectProjectEventByRequestId({
                  requestId: event.requestId,
                }),
              ),
            )
            if (!eventInStore) {
              this.logger.debug({
                source: 'ProjectsHubsEffects',
                objects: ['onReceiveManySignalREvents', 'new event', event],
              })
              this.projectsHubRepository.addSignalrRequest(event)
              continue
            }
            this.logger.debug({
              source: 'ProjectsHubsEffects',
              objects: ['onReceiveManySignalREvents', 'event already in store', event],
            })
            if (!event.serverTime) {
              this.logger.debug({
                source: 'ProjectsHubsEffects',
                objects: ['onReceiveManySignalREvents', 'event.serverTime is null', event],
              })
              continue
            }
            // event.serverTime = event.serverTime ?? throwExpression("event.serverTime can't be null")
            /*          if (!event.serverTime) {
                        this.logger.debug({
                          source: 'ProjectsHubsEffects',
                          objects: ['onReceiveManySignalREvents', 'event.serverTime is null', event],
                        })
                        continue
                      }*/

            const timeDiff =
              new Date(event.serverTime).getTime() - new Date(eventInStore.time).getTime()
            const update: Update<ProjectSignalrEvent> = {
              id: event.requestId,
              changes: {
                ...event,
                timeDiff,
              },
            }
            this.projectsHubRepository.updateSignalrRequest(update)
          }
        }),
      ),
    { dispatch: false },
  )
}
