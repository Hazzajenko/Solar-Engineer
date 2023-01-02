import { inject, Injectable } from '@angular/core'
import { GridEventFactory, GridFactory, LinkFactory, MouseEventRequest } from '@grid-layout/data-access/utils'
import {
  LinksFacade
} from '@project-id/data-access/facades'
import { BlockType, PanelModel } from '@shared/data-access/models'

import { GridEventResult } from '@grid-layout/data-access/actions'

import { LinksState } from '@project-id/shared/models'

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  private result = new GridEventFactory()
  private linkFactory = inject(LinkFactory)
  private gridFactory = inject(GridFactory)
  private linksFacade = inject(LinksFacade)

  async addPanelToLink(click: MouseEventRequest, panel: PanelModel): Promise<GridEventResult> {
    const linksState = await this.linksFacade.state
    if (panel.stringId === 'undefined') {
      return this.gridFactory.clearState('panel needs to be apart of a string')
    }

    if (!linksState?.typeToLink || !linksState?.toLinkId) {
      const existingPanelPositiveLink = await this.linksFacade.isPanelExistingPositiveLink(panel.id)

      if (existingPanelPositiveLink) {
        return this.result.error('this panel already has a positive link')
      }
      return this.linkFactory.startLinkPanel(panel.id)
    }

    return this.typeToLink(linksState, click, panel)
  }

  private async typeToLink(linksState: LinksState, click: MouseEventRequest, panel: PanelModel) {
    switch (linksState.typeToLink) {
      case BlockType.PANEL:
        return this.linkFactory.create(panel, linksState.toLinkId, click.event.shiftKey)
      default:
        return this.result.fatal('unknown type to link')
    }
  }
}
