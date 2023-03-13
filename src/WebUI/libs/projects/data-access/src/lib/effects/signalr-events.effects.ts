import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, switchMap, tap } from 'rxjs/operators'
import { SignalrEventsActions } from '../store'
import { BaseService } from '@shared/logger'
import { SignalrEventsFacade, SignalrEventsRepository } from '../services'
import { Store } from '@ngrx/store'
import { Update } from '@ngrx/entity'
import {
  PanelModel,
  ProjectModelType,
  ProjectSignalrEvent,
  StringModel,
} from '@shared/data-access/models'
import { combineLatest, firstValueFrom, of } from 'rxjs'
import {
  PanelArraySchema,
  PanelArraySchemaModel,
  PanelLinkJsonModel,
  PanelLinkSchemaModel,
  PanelSchema,
  PanelSchemaModel,
  StringSchema,
  StringSchemaModel,
} from '@shared/utils'
import { PanelsActions, StringsActions } from '@grid-layout/data-access'
import { UpdateStr } from '@ngrx/entity/src/models'
import { HandleEventsService } from '../utils/handle-events.service'

@Injectable({
  providedIn: 'root',
})
export class SignalrEventsEffects extends BaseService {
  private actions$ = inject(Actions)
  private store = inject(Store)
  // private logger = inject(LoggerService)
  private signalrEventsFacade = inject(SignalrEventsFacade)
  private signalrEventsRepository = inject(SignalrEventsRepository)
  private handleEventsService = inject(HandleEventsService)

  /*  constructor(logger: LoggerService) {
      super(logger)
    }*/

  onReceiveSignalrEventV3$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SignalrEventsActions.receiveSignalrEvent),
        switchMap(({ projectSignalrEvent }) =>
          combineLatest([
            of(projectSignalrEvent),
            this.signalrEventsFacade.selectSignalrEventByRequestId$(projectSignalrEvent.requestId),
          ]),
        ),
        tap(([projectSignalrEvent, existing]) => {
          this.handleEventsService.handleEvent(projectSignalrEvent, existing)
        }),
      ),
    { dispatch: false },
  )
  /*
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
              // this.signalrEventsRepository.updateSignalrEvent(update)
              const json = this.throwIfNull(newEvent.data, 'data is null')
              // JsonSchema.parse(json)
              if (newEvent.model == ProjectModelType.Panel) {
                const containsMany = newEvent.action.includes('Many')
                if (containsMany) {
                  this.logDebug(
                    'onReceiveSignalrEvent',
                    "newEvent.action.includes('Many')",
                    'update panel array',
                    json,
                  )
                  const panelArrayJsonModel: PanelArraySchemaModel = JSON.parse(json)
                  const panels: PanelModel[] = PanelArraySchema.parse(panelArrayJsonModel)
                  this.logDebug('onReceiveSignalrEvent', 'update panel array validate', panels)

                  const updates: UpdateStr<PanelModel>[] = panels.map(
                    (panel) =>
                      ({
                        id: panel.id,
                        changes: panel,
                      } as UpdateStr<PanelModel>),
                  )
                  this.logDebug('onReceiveSignalrEvent', 'update panel array updates', updates)
                  this.store.dispatch(PanelsActions.updateManyPanelsWithoutSignalr({ updates }))
                  return
                }

                const panelJson: PanelSchemaModel = JSON.parse(json)
                const panel = PanelSchema.parse(panelJson)
                this.logDebug('onReceiveSignalrEvent', 'update panel validate', panel)

                const update: UpdateStr<PanelModel> = {
                  id: panel.id,
                  changes: panel,
                }
                this.store.dispatch(PanelsActions.updatePanelWithoutSignalr({ update }))
                return
              }
              if (newEvent.model == ProjectModelType.String) {
                const stringJson: StringSchemaModel = JSON.parse(json)
                const validate = StringSchema.parse(stringJson)
                this.logDebug('onReceiveSignalrEvent', 'update string validate', validate)
                const string: StringModel = {
                  ...validate,
                  type: ProjectModelType.String,
                }
                const update: UpdateStr<StringModel> = {
                  id: string.id,
                  changes: string,
                }
                this.store.dispatch(StringsActions.updateStringWithoutSignalr({ update }))
              }
              if (newEvent.model == ProjectModelType.PanelLink) {
                const linkJson: PanelLinkJsonModel = JSON.parse(json)
                const validate = PanelLinkSchemaModel.parse(linkJson)
                this.logDebug('onReceiveSignalrEvent', 'update link validate', validate)
              }
            } else {
              this.signalrEventsRepository.addSignalrEvent(newEvent)
              const json = this.throwIfNull(newEvent.data, 'data is null')
              if (newEvent.model == ProjectModelType.Panel) {
                const panelJson: PanelSchemaModel = JSON.parse(json)
                const validate = PanelSchema.parse(panelJson)
                this.logDebug('onReceiveSignalrEvent', 'add panel validate', validate)
                const panel: PanelModel = {
                  ...validate,
                  type: ProjectModelType.Panel,
                }
                this.store.dispatch(PanelsActions.addPanelWithoutSignalr({ panel }))
              }
              if (newEvent.model == ProjectModelType.String) {
                // this.logDebug('onReceiveSignalrEvent', 'add string', newEvent)
                const stringJson: StringSchemaModel = JSON.parse(json)
                const validate = StringSchema.parse(stringJson)
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
    )*/
  // { dispatch: false },
  // )

  onReceiveManySignalREvents$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SignalrEventsActions.receiveManySignalrEvents),
        map(async ({ projectSignalrEvents }) => {
          /*     for (const projectSignalrEvent of projectSignalrEvents) {
               }*/
          const existingEvent$ = this.signalrEventsFacade.selectSignalrEventByRequestId$(
            projectSignalrEvents[0].requestId,
          )
          const existing = await firstValueFrom(existingEvent$)
          const newEvent = projectSignalrEvents[0]
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
            // this.signalrEventsRepository.updateSignalrEvent(update)
            const json = this.throwIfNull(newEvent.data, 'data is null')
            // JsonSchema.parse(json)
            if (newEvent.model == ProjectModelType.Panel) {
              const containsMany = newEvent.action.includes('Many')
              if (containsMany) {
                this.logDebug(
                  'onReceiveSignalrEvent',
                  "newEvent.action.includes('Many')",
                  'update panel array',
                  json,
                )
                const panelArrayJsonModel: PanelArraySchemaModel = JSON.parse(json)
                const panels: PanelModel[] = PanelArraySchema.parse(panelArrayJsonModel)
                this.logDebug('onReceiveSignalrEvent', 'update panel array validate', panels)

                const updates: UpdateStr<PanelModel>[] = panels.map(
                  (panel) =>
                    ({
                      id: panel.id,
                      changes: panel,
                    } as UpdateStr<PanelModel>),
                )
                this.logDebug('onReceiveSignalrEvent', 'update panel array updates', updates)
                this.store.dispatch(PanelsActions.updateManyPanelsWithoutSignalr({ updates }))
                return
              }

              const panelJson: PanelSchemaModel = JSON.parse(json)
              const panel = PanelSchema.parse(panelJson)
              this.logDebug('onReceiveSignalrEvent', 'update panel validate', panel)

              const update: UpdateStr<PanelModel> = {
                id: panel.id,
                changes: panel,
              }
              this.store.dispatch(PanelsActions.updatePanelWithoutSignalr({ update }))
              return
            }
            if (newEvent.model == ProjectModelType.String) {
              const stringJson: StringSchemaModel = JSON.parse(json)
              const validate = StringSchema.parse(stringJson)
              this.logDebug('onReceiveSignalrEvent', 'update string validate', validate)
              const string: StringModel = {
                ...validate,
                type: ProjectModelType.String,
              }
              const update: UpdateStr<StringModel> = {
                id: string.id,
                changes: string,
              }
              this.store.dispatch(StringsActions.updateStringWithoutSignalr({ update }))
            }
            if (newEvent.model == ProjectModelType.PanelLink) {
              const linkJson: PanelLinkJsonModel = JSON.parse(json)
              const validate = PanelLinkSchemaModel.parse(linkJson)
              this.logDebug('onReceiveSignalrEvent', 'update link validate', validate)
            }
          } else {
            this.signalrEventsRepository.addSignalrEvent(newEvent)
            const json = this.throwIfNull(newEvent.data, 'data is null')
            if (newEvent.model == ProjectModelType.Panel) {
              const panelJson: PanelSchemaModel = JSON.parse(json)
              const validate = PanelSchema.parse(panelJson)
              this.logDebug('onReceiveSignalrEvent', 'add panel validate', validate)
              const panel: PanelModel = {
                ...validate,
                type: ProjectModelType.Panel,
              }
              this.store.dispatch(PanelsActions.addPanelWithoutSignalr({ panel }))
            }
            if (newEvent.model == ProjectModelType.String) {
              // this.logDebug('onReceiveSignalrEvent', 'add string', newEvent)
              const stringJson: StringSchemaModel = JSON.parse(json)
              const validate = StringSchema.parse(stringJson)
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
}
