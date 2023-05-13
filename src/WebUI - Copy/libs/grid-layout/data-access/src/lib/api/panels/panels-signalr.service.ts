import { inject, Injectable } from '@angular/core'
import { CreatePanel, UpdateManyPanels, UpdatePanel } from '@projects/data-access'
import { CreatePanelRequest, UpdateManyPanelsRequest, UpdatePanelRequest } from '../../contracts'
import { LoggerService } from '@shared/logger'
import { HubConnection } from '@microsoft/signalr'

@Injectable({
  providedIn: 'root',
})
export class PanelsSignalrService {
  private hub?: HubConnection
  private logger = inject(LoggerService)

  initPanelsHub(projectsHubConnection: HubConnection) {
    this.hub = projectsHubConnection
    /*    this.hub.on(PanelsCreated, (response: PanelCreatedResponse) => {
          this.logger.debug({
            source: 'Panels-Signalr-Service',
            objects: [PanelsCreated, response],
          })
        })
        this.hub.on(PanelsUpdated, (panel) => {
          this.logger.debug({
            source: 'Panels-Signalr-Service',
            objects: [PanelsUpdated, panel],
          })
        })*/
  }

  addPanelSignalr(request: CreatePanelRequest) {
    if (!this.hub) return
    this.hub.invoke(CreatePanel, request).catch(
      (e) => e,
      // this.logger.error({ source: 'PanelsSignalrService', objects: ['addPanelSignalr', e] }),
    )
  }

  updatePanelSignalr(request: UpdatePanelRequest) {
    if (!this.hub) return
    this.hub.invoke(UpdatePanel, request).catch(
      (e) => e,
      // this.logger.error({ source: 'PanelsSignalrService', objects: ['updatePanelSignalr', e] }),
    )
  }

  updateManyPanelsSignalr(request: UpdateManyPanelsRequest) {
    if (!this.hub) return
    this.hub.invoke(UpdateManyPanels, request).catch(
      (e) => e,
      /*      this.logger.error({
              source: 'PanelsSignalrService',
              objects: ['updateManyPanelsSignalr', e],
            }),*/
    )
  }
}
