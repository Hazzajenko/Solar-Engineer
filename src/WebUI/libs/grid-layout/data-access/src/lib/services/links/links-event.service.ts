import { inject, Injectable } from '@angular/core'

import { GridStoreService, LinksFacade } from '../'

import { BlockType, PanelModel } from '@shared/data-access/models'
// import { GridService } from 'libs/grid-layout/data-access/services/src/lib/entitites/grid/grid.service'
import { LinksFactory } from './links.factory'
// import { GridService } from '@grid-layout/data-access/services'
import { MouseEventRequest, LinksStateModel } from '../../models'
import { LoggerService } from '@shared/logger'

// import { MouseEventRequest } from '../../../models/mouse-event-request'

@Injectable({
  providedIn: 'root',
})
export class LinksEventService {
  private linksFactory = inject(LinksFactory)
  // private gridFactory = inject(GridService)
  private gridStore = inject(GridStoreService)
  private linksFacade = inject(LinksFacade)
  private logger = inject(LoggerService)

  async addPanelToLink(click: MouseEventRequest, panel: PanelModel) {
    const linksState = await this.linksFacade.state
    if (panel.stringId === 'undefined') {
      // console.log('panel needs to be apart of a string')
      this.gridStore.dispatch.clearEntireGridState()
      // return this.gridFactory.clearState('panel needs to be apart of a string')
    }

    if (!linksState?.typeToLink || !linksState?.toLinkId) {
      const existingPanelPositiveLink = await this.linksFacade.isPanelExistingPositiveLink(panel.id)

      if (existingPanelPositiveLink) {
        return this.logger.debug({ source: 'LinksEventService', objects: ['this panel already has a positive link'] })
        // return console.error('this panel already has a positive link')
      }
      return this.linksFactory.startLinkPanel(panel.id)
    }

    return this.typeToLink(linksState, click, panel)
  }

  private async typeToLink(
    linksState: LinksStateModel,
    click: MouseEventRequest,
    panel: PanelModel,
  ) {
    switch (linksState.typeToLink) {
      case BlockType.PANEL:
        return this.linksFactory.create(panel, linksState.toLinkId, click.event.shiftKey)
      default:
        return this.logger.debug({ source: 'LinksEventService', objects: ['unknown type to link'] })
      // return console.error('unknown type to link')
    }
  }
}
