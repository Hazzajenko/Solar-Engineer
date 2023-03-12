import { inject, Injectable } from '@angular/core'
import { Logger, LoggerService } from '@shared/logger'
import {
  PanelModel,
  ProjectModelType,
  ProjectSignalrEvent,
  StringModel,
} from '@shared/data-access/models'
import {
  JsonSchema,
  PanelArraySchema,
  PanelArraySchemaModel,
  PanelLinkJsonModel,
  PanelLinkSchemaModel,
  PanelSchema,
  PanelSchemaModel,
  StringSchema,
  StringSchemaModel,
} from '@shared/utils'
import { UpdateStr } from '@ngrx/entity/src/models'
import { PanelsActions, StringsActions } from '@grid-layout/data-access'
import { SignalrEventsFacade, SignalrEventsRepository } from '../services'
import { Store } from '@ngrx/store'

@Injectable({
  providedIn: 'root',
})
export class HandleEventsService extends Logger {
  private signalrEventsRepository = inject(SignalrEventsRepository)
  private store = inject(Store)
  private signalrEventsFacade = inject(SignalrEventsFacade)

  constructor(logger: LoggerService) {
    super(logger)
  }

  handleEvent(newEvent: ProjectSignalrEvent, existing?: ProjectSignalrEvent) {
    this.logDebug('handleEvent', newEvent)
    if (!newEvent.serverTime) {
      this.logError('onReceiveSignalrEvent', 'event.serverTime is null', newEvent)
      return
    }
    if (!newEvent.isSuccess || newEvent.error) {
      this.logError('onReceiveSignalrEvent', 'event is not success', newEvent)
      return
    }
    const json = this.throwIfNull(newEvent.data, 'data is null')
    JsonSchema.parse(json)
    if (existing) {
      switch (newEvent.model) {
        case ProjectModelType.Panel:
          return this.handlePanelEvent(newEvent, json)
        case ProjectModelType.String:
          return this.handleStringEvent(newEvent, json)
        case ProjectModelType.PanelLink:
          return this.handlePanelLinkEvent(newEvent, json)
        default:
          return this.logError('onReceiveSignalrEvent', 'unknown model', newEvent)
      }
    }
    return this.handleNewEvent(newEvent, json)
  }

  private handlePanelEvent(event: ProjectSignalrEvent, json: string) {
    const containsMany = event.action.includes('Many')
    if (containsMany) {
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

  private handleStringEvent(event: ProjectSignalrEvent, json: string) {
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

  private handlePanelLinkEvent(event: ProjectSignalrEvent, json: string) {
    const linkJson: PanelLinkJsonModel = JSON.parse(json)
    const validate = PanelLinkSchemaModel.parse(linkJson)
    this.logDebug('onReceiveSignalrEvent', 'update link validate', validate)
  }

  private handleNewEvent(event: ProjectSignalrEvent, json: string) {
    this.signalrEventsRepository.addSignalrEvent(event)
    if (event.model == ProjectModelType.Panel) {
      const panelJson: PanelSchemaModel = JSON.parse(json)
      const panel: PanelModel = PanelSchema.parse(panelJson)
      this.logDebug('onReceiveSignalrEvent', 'add panel validate', panel)

      this.store.dispatch(PanelsActions.addPanelWithoutSignalr({ panel }))
      return
    }
    if (event.model == ProjectModelType.String) {
      const stringJson: StringSchemaModel = JSON.parse(json)
      const string: StringModel = StringSchema.parse(stringJson)
      this.logDebug('onReceiveSignalrEvent', 'add string validate', string)

      this.store.dispatch(StringsActions.addStringWithoutSignalr({ string }))
      return
    }
    return
  }
}
