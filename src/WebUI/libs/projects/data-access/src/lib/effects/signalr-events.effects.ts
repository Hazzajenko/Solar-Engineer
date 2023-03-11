import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, switchMap } from 'rxjs/operators'
import { SignalrEventsActions } from '../store'
import { Logger, LoggerService } from '@shared/logger'
import { SignalrEventsFacade, SignalrEventsRepository } from '../services'
import { Store } from '@ngrx/store'
import { Update } from '@ngrx/entity'
import {
  PanelModel,
  ProjectModelType,
  ProjectSignalrEvent,
  StringModel,
} from '@shared/data-access/models'
import { combineLatest, firstValueFrom } from 'rxjs'
import {
  PanelJsonModel,
  PanelSchemaModel,
  ProjectItemUpdate,
  StringJsonModel,
  StringSchemaModel,
} from '@shared/utils'
import { PanelsActions, StringsActions } from '@grid-layout/data-access'
import {
  PanelLinkJsonModel,
  PanelLinkSchemaModel,
} from '../../../../../shared/utils/src/lib/mapping/panel-link.mapper'

@Injectable({
  providedIn: 'root',
})
export class SignalrEventsEffects extends Logger {
  private actions$ = inject(Actions)
  private store = inject(Store)
  // private logger = inject(LoggerService)
  private signalrEventsFacade = inject(SignalrEventsFacade)
  private signalrEventsRepository = inject(SignalrEventsRepository)

  constructor(logger: LoggerService) {
    super(logger)
  }

  /*  onSendSignalRRequest$ = createEffect(() =>
      this.actions$.pipe(
        ofType(SignalrEventsActions.sendSignalrEvent),
        tap(({ projectSignalrEvent }) =>
          this.logger.debug({
            source: 'SignalrEventsEffects',
            objects: ['onSendSignalRRequest', projectSignalrEvent],
          }),
        ),
      ),
    )*/
  /*
    onReceiveSignalrEvent$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(SignalrEventsActions.receiveSignalrEvent),
          switchMap(({ projectSignalrEvent }) => {
            const existingEvent$ = this.signalrEventsFacade
              .selectSignalrEventByRequestId$(projectSignalrEvent.requestId)
              .pipe(
                map((existing) => {
                  if (existing) {
                    return existing
                  }
                  return null
                }),
              )
            return existingEvent$.pipe(
              map((existing) => {
                return {
                  existing,
                  newEvent: projectSignalrEvent,
                }
              }),
            )
          }),
          map((data) => {
            const { existing, newEvent } = data
            if (!newEvent.serverTime) {
              this.logError('onReceiveSignalrEvent', 'event.serverTime is null', newEvent)
              return
            }
            if (!newEvent.isSuccess || newEvent.error) {
              this.logError('onReceiveSignalrEvent', 'event is not success', newEvent)
              return
            }
            if (existing) {
              const timeDiff =
                new Date(newEvent.serverTime).getTime() - new Date(existing.time).getTime()
              const update: Update<ProjectSignalrEvent> = {
                id: existing.requestId,
                changes: {
                  ...existing,
                  timeDiff,
                },
              }
              this.signalrEventsRepository.updateSignalrEvent(update)
            } else {
              this.signalrEventsRepository.addSignalrEvent(newEvent)
            }
          }),
        ),
      { dispatch: false },
    )*/

  onReceiveSignalrEventV2$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SignalrEventsActions.receiveSignalrEvent),
        map(async ({ projectSignalrEvent }) => {
          const existingEvent$ = this.signalrEventsFacade.selectSignalrEventByRequestId$(
            projectSignalrEvent.requestId,
          )
          const existing = await firstValueFrom(existingEvent$)
          const newEvent = projectSignalrEvent
          if (!newEvent.serverTime) {
            this.logError('onReceiveSignalrEvent', 'event.serverTime is null', newEvent)
            return
          }
          if (!newEvent.isSuccess || newEvent.error) {
            this.logError('onReceiveSignalrEvent', 'event is not success', newEvent)
            return
          }
          if (existing) {
            const timeDiff =
              new Date(newEvent.serverTime).getTime() - new Date(existing.time).getTime()
            const update: Update<ProjectSignalrEvent> = {
              id: existing.requestId,
              changes: {
                ...newEvent,
                timeDiff,
              },
            }
            this.signalrEventsRepository.updateSignalrEvent(update)
            const json = this.throwIfNull(newEvent.data, 'data is null')
            if (existing.model == ProjectModelType.Panel) {
              const panelJson: PanelJsonModel = JSON.parse(json)
              const validate = PanelSchemaModel.parse(panelJson)
              this.logDebug('onReceiveSignalrEvent', 'update panel validate', validate)
              const panel: PanelModel = {
                ...validate,
                type: ProjectModelType.Panel,
              }
              const update: ProjectItemUpdate<PanelModel> = {
                id: panel.id,
                projectId: panel.projectId,
                changes: panel,
              }
              // this.store.dispatch(PanelsActions.updatePanelWithoutSignalrv2({ update }))
              this.store.dispatch(PanelsActions.updatePanelWithoutSignalr({ update }))
            }
            if (existing.model == ProjectModelType.String) {
              // this.logDebug('onReceiveSignalrEvent', 'update string', newEvent)
              const stringJson: StringJsonModel = JSON.parse(json)
              const validate = StringSchemaModel.parse(stringJson)
              this.logDebug('onReceiveSignalrEvent', 'update string validate', validate)
              const string: StringModel = {
                ...validate,
                type: ProjectModelType.String,
              }
              const update: ProjectItemUpdate<StringModel> = {
                id: string.id,
                projectId: string.projectId,
                changes: string,
              }
              this.store.dispatch(StringsActions.updateStringWithoutSignalr({ update }))
            }
            if (existing.model == ProjectModelType.PanelLink) {
              // this.logDebug('onReceiveSignalrEvent', 'update string', newEvent)
              const linkJson: PanelLinkJsonModel = JSON.parse(json)
              const validate = PanelLinkSchemaModel.parse(linkJson)
              this.logDebug('onReceiveSignalrEvent', 'update link validate', validate)
              /*   const link: PanelLinkModel = {
                   ...validate,
                   type: ProjectModelType.PanelLink,
                 }
                 const update: ProjectItemUpdate<PanelLinkModel> = {
                   id: link.id,
                   projectId: link.projectId,
                   changes: link,
                 }
                 this.store.dispatch(LinksActions.updateLinkWithoutSignalr({ update }))*/
            }
          } else {
            this.signalrEventsRepository.addSignalrEvent(newEvent)
            const json = this.throwIfNull(newEvent.data, 'data is null')
            if (newEvent.model == ProjectModelType.Panel) {
              const panelJson: PanelJsonModel = JSON.parse(json)
              const validate = PanelSchemaModel.parse(panelJson)
              this.logDebug('onReceiveSignalrEvent', 'add panel validate', validate)
              const panel: PanelModel = {
                ...validate,
                type: ProjectModelType.Panel,
              }
              this.store.dispatch(PanelsActions.addPanelWithoutSignalr({ panel }))
            }
            if (newEvent.model == ProjectModelType.String) {
              // this.logDebug('onReceiveSignalrEvent', 'add string', newEvent)
              const stringJson: StringJsonModel = JSON.parse(json)
              const validate = StringSchemaModel.parse(stringJson)
              this.logDebug('onReceiveSignalrEvent', 'add string validate', validate)
              const string: StringModel = {
                ...validate,
                type: ProjectModelType.String,
              }
              this.store.dispatch(StringsActions.addStringWithoutSignalr({ string }))
            }
          }
        }),
      ),
    { dispatch: false },
  )
  // { dispatch: false },
  // )

  onReceiveManySignalREvents$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SignalrEventsActions.receiveManySignalrEvents),
        switchMap(({ projectSignalrEvents }) => {
          const requestIds = projectSignalrEvents.map((x) => x.requestId)
          const existingEvents$ = this.signalrEventsFacade
            .selectManySignalrEventsByRequestIds$(requestIds)
            .pipe(
              map((existing) => {
                const existingIds = existing.map((x) => x.requestId)

                return projectSignalrEvents.filter((signalrEvent) =>
                  existingIds.includes(signalrEvent.requestId),
                )
              }),
            )
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
          console.log(data)
          for (const event of existingEvents) {
            if (!event.isSuccess || event.error) {
              this.logError('onReceiveManySignalREvents', 'event is not success', event)
              continue
            }
            if (!event.serverTime) {
              this.logError('onReceiveManySignalREvents', 'event.serverTime is null', event)
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
