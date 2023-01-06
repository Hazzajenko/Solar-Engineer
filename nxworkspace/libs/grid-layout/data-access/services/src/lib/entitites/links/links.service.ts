import { inject, Injectable } from '@angular/core'

import { LinksFacade } from '@project-id/data-access/facades'

import { LinksState } from '@project-id/shared/models'
import { BlockType, PanelModel } from '@shared/data-access/models'
import { GridFactory } from '../grid/grid.factory'
import { LinksFactory } from './links.factory'
import { MouseEventRequest } from '../../mouse-event-request'

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  private linksFactory = inject(LinksFactory)
  private gridFactory = inject(GridFactory)
  private linksFacade = inject(LinksFacade)

  async addPanelToLink(click: MouseEventRequest, panel: PanelModel) {
    const linksState = await this.linksFacade.state
    if (panel.stringId === 'undefined') {
      return this.gridFactory.clearState('panel needs to be apart of a string')
    }

    if (!linksState?.typeToLink || !linksState?.toLinkId) {
      const existingPanelPositiveLink = await this.linksFacade.isPanelExistingPositiveLink(panel.id)

      if (existingPanelPositiveLink) {
        return console.error('this panel already has a positive link')
      }
      return this.linksFactory.startLinkPanel(panel.id)
    }

    return this.typeToLink(linksState, click, panel)
  }

  private async typeToLink(linksState: LinksState, click: MouseEventRequest, panel: PanelModel) {
    switch (linksState.typeToLink) {
      case BlockType.PANEL:
        return this.linksFactory.create(panel, linksState.toLinkId, click.event.shiftKey)
      default:
        return console.error('unknown type to link')
    }
  }
}
