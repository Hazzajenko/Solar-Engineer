import { inject, Injectable } from '@angular/core'
import { BaseService } from '@shared/logger'
import { GridPanelModel, GridStringModel, ProjectModelType, ProjectSignalrEvent } from '@shared/data-access/models'
import { JsonSchema, PanelArraySchema, PanelArraySchemaModel, PanelLinkJsonModel, PanelLinkSchemaModel, PanelSchema, PanelSchemaModel, StringSchema, StringSchemaModel } from '@shared/utils'
import { UpdateStr } from '@ngrx/entity/src/models'
import { GridPanelsActions, GridStringsActions } from '@grid-layout/data-access'
import { SignalrEventsFacade, SignalrEventsRepository } from '../services'
import { Store } from '@ngrx/store'

@Injectable({
  providedIn: 'root',
})
export class HandleEventsService
  extends BaseService {
  private signalrEventsRepository = inject(SignalrEventsRepository)
  private store = inject(Store)
  private signalrEventsFacade = inject(SignalrEventsFacade)

  /*  constructor(logger: LoggerService) {
   super(logger)
   }*/

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
      const panels: GridPanelModel[] = PanelArraySchema.parse(panelArrayJsonModel)
      this.logDebug('onReceiveSignalrEvent', 'update panel array validate', panels)

      const updates: UpdateStr<GridPanelModel>[] = panels.map(
        (panel) =>
          ({
            id:      panel.id,
            changes: panel,
          } as UpdateStr<GridPanelModel>),
      )
      this.logDebug('onReceiveSignalrEvent', 'update panel array updates', updates)
      this.store.dispatch(GridPanelsActions.updateManyPanelsWithoutSignalr({ updates }))
      return
    }

    const panelJson: PanelSchemaModel = JSON.parse(json)
    const panel = PanelSchema.parse(panelJson)
    this.logDebug('onReceiveSignalrEvent', 'update panel validate', panel)

    const update: UpdateStr<GridPanelModel> = {
      id:      panel.id,
      changes: panel,
    }
    this.store.dispatch(GridPanelsActions.updatePanelWithoutSignalr({ update }))
    return
  }

  private handleStringEvent(event: ProjectSignalrEvent, json: string) {
    const stringJson: StringSchemaModel = JSON.parse(json)
    const validate = StringSchema.parse(stringJson)
    this.logDebug('onReceiveSignalrEvent', 'update string validate', validate)
    const string: GridStringModel = {
      ...validate,
      type: ProjectModelType.String,
    }
    const update: UpdateStr<GridStringModel> = {
      id:      string.id,
      changes: string,
    }
    this.store.dispatch(GridStringsActions.updateStringWithoutSignalr({ update }))
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
      const panel: GridPanelModel = PanelSchema.parse(panelJson)
      this.logDebug('onReceiveSignalrEvent', 'add panel validate', panel)

      this.store.dispatch(GridPanelsActions.addPanelWithoutSignalr({ panel }))
      return
    }
    if (event.model == ProjectModelType.String) {
      const stringJson: StringSchemaModel = JSON.parse(json)
      const string: GridStringModel = StringSchema.parse(stringJson)
      this.logDebug('onReceiveSignalrEvent', 'add string validate', string)

      this.store.dispatch(GridStringsActions.addStringWithoutSignalr({ string }))
      return
    }
    return
  }
}
