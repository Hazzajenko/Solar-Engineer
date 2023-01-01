import { inject, Injectable } from '@angular/core'
import { GridEventFactory, GridFactory, LinkFactory } from '@grid-layout/data-access/utils'
import {
  BlocksFacade,
  GridFacade,
  LinksFacade,
  MultiFacade,
  PanelsFacade,
  SelectedFacade,
} from '@project-id/data-access/facades'
import { ProjectsFacade } from '@projects/data-access/facades'
import { BlockModel, PanelModel } from '@shared/data-access/models'

import { GridEventResult } from '@grid-layout/data-access/actions'
import { MouseEventRequest } from '@grid-layout/shared/models'
import { TypeToLink } from './type-to-link'
import { P } from 'ts-pattern'

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  private multiFacade = inject(MultiFacade)
  private result = new GridEventFactory()
  private gridFacade = inject(GridFacade)
  private blocksFacade = inject(BlocksFacade)
  private selectedFacade = inject(SelectedFacade)
  private linkFactory = inject(LinkFactory)
  private gridFactory = inject(GridFactory)
  private linksFacade = inject(LinksFacade)
  private typeToLink = inject(TypeToLink)

  async addPanelToLink(click: MouseEventRequest, panel: PanelModel): Promise<GridEventResult> {
    const linksState = await this.linksFacade.state
    // const panel = await this.panelsFacade.panelById(block.id)
    /*     if (!panel) {
      return this.result.action({
        action: 'CLEAR_GRID_STATE',
        data: { log: 'addPanelToJoin !panel' },
      })

      /*       return this.linksRepository.updateState(
        this.result.action({ action: 'CLEAR_GRID_STATE', data: { log: 'addPanelToJoin !panel' } }),
      )
    } */
    if (panel.stringId === 'undefined') {
      return this.gridFactory.clearState('panel needs to be apart of a string')
      /*       return this.result.action({
        action: 'CLEAR_GRID_STATE',
        data: { log: 'panel needs to be apart of a string' },
      }) */

      /*       return this.linksRepository.updateState(
        this.result.action({
          action: 'CLEAR_GRID_STATE',
          data: { log: 'panel needs to be apart of a string' },
        }),
      ) */
    }

    if (!linksState?.typeToLink || !linksState?.toLinkId) {
      const existingPanelPositiveLink = await this.linksFacade.isPanelExistingPositiveLink(panel.id)

      if (existingPanelPositiveLink) {
        return this.result.error('this panel already has a positive link')

        /*         return this.linksRepository.updateState(
          this.result.error('this panel already has a positive link'),
        ) */
      }
      return this.linkFactory.startLinkPanel(panel.id)
      // return this.result.action({ action: 'START_LINK_PANEL', data: { panelId: panel.id } })

      /*       return this.linksRepository.updateState(
        this.result.action({ action: 'START_LINK_PANEL', data: { panelId: panel.id } }),
      ) */
    }

    // return this.linkFactory.create
    return this.typeToLink.typeToLink(linksState, click, panel)
    /*     const result = await match(linksState.typeToLink)
          .with(
            BlockType.PANEL,
            async () => await this.linkPanel(linksState.toLinkId, click.event.shiftKey, panel),
          )
          .otherwise(async () => this.result.fatal('unknown type to link'))
        return result */
    // return this.linksRepository.updateState(result)
  }
}
