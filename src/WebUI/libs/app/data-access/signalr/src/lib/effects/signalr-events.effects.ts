import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, switchMap, tap } from 'rxjs/operators'
import { SignalrEventsActions } from '../store'
import { LoggerService } from '@shared/logger'
import { SignalrEventsFacade, SignalrEventsRepository } from '../services'
import { Store } from '@ngrx/store'
import { Update } from '@ngrx/entity'
import { ProjectSignalrEvent } from '@shared/data-access/models'
import { combineLatest } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class SignalrEventsEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)
  private logger = inject(LoggerService)
  private signalrEventsFacade = inject(SignalrEventsFacade)
  private signalrEventsRepository = inject(SignalrEventsRepository)

  onSendSignalRRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SignalrEventsActions.sendSignalrEvent),
      tap(({ projectSignalrEvent }) =>
        this.logger.debug({
          source: 'SignalrEventsEffects',
          objects: ['onSendSignalRRequest', projectSignalrEvent],
        }),
      ),
    ),
  )

  onReceiveManySignalREvents$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SignalrEventsActions.receiveManySignalrEvents),
        switchMap(({ projectSignalrEvents }) => {
          const requestIds = projectSignalrEvents.map((x) => x.requestId)
          const existingEvents$ =
            this.signalrEventsFacade.selectManySignalrEventsByRequestIds(requestIds)
          const newEvents$ = existingEvents$.pipe(
            map((existing) =>
              existing.filter((x) => !existing.find((y) => y.requestId === x.requestId)),
            ),
          )
          return combineLatest([newEvents$, existingEvents$]).pipe(
            map(([newEvents, existingEvents]) => {
              return {
                newEvents,
                existingEvents,
              }
            }),
          )
        }),
        map((data) => {
          const { newEvents, existingEvents } = data
          for (const event of existingEvents) {
            if (!event.isSuccess || event.error) {
              this.logger.error({
                source: 'SignalrEventsEffects',
                objects: ['onReceiveManySignalREvents', 'event is not success', event],
              })
              continue
            }
            if (!event.serverTime) {
              this.logger.debug({
                source: 'SignalrEventsEffects',
                objects: ['onReceiveManySignalREvents', 'event.serverTime is null', event],
              })
              continue
            }
            const timeDiff = new Date(event.serverTime).getTime() - new Date(event.time).getTime()
            const update: Update<ProjectSignalrEvent> = {
              id: event.requestId,
              changes: {
                ...event,
                timeDiff,
              },
            }
            this.signalrEventsRepository.updateSignalrEvent(update)
          }
          this.signalrEventsRepository.addManySignalrEvents(newEvents)
        }),
      ),
    { dispatch: false },
  )
}
