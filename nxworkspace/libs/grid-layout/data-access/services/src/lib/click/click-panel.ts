import { GridEventFactory, PanelFactory } from '@grid-layout/data-access/utils'
import { inject, Injectable } from '@angular/core'
import {
  BlocksFacade,
  GridFacade,
  MultiFacade,
  PanelsFacade,
  SelectedFacade,
  StringsFacade,
} from '@project-id/data-access/facades'
import { ProjectsFacade } from '@projects/data-access/facades'
import { BlockModel, BlockType, GridMode, PanelModel } from '@shared/data-access/models'

import { match, P } from 'ts-pattern'

import { LinksService } from '../links/links.service'

import { MouseEventRequest } from '@grid-layout/shared/models'
import { GridEventResult } from '@grid-layout/data-access/actions'

@Injectable({
  providedIn: 'root',
})
export class ClickPanelService {
  private multiFacade = inject(MultiFacade)
  private eventFactory = new GridEventFactory()
  private gridFacade = inject(GridFacade)
  private blocksFacade = inject(BlocksFacade)
  private projectsFacade = inject(ProjectsFacade)
  private stringsFacade = inject(StringsFacade)
  private panelFactory = inject(PanelFactory)
  private selectedFacade = inject(SelectedFacade)
  private linksService = inject(LinksService)

  async clickPanelSwitch(click: MouseEventRequest, panel: BlockModel): Promise<GridEventResult> {
    if (!(panel instanceof PanelModel)) {
      return this.eventFactory.error('!(panel instanceof PanelModel)')
    }

    const gridMode = await this.gridFacade.gridMode

    switch (gridMode) {
      // case GridMode.CREATE: return this.result.action({ action: 'SELECT_PANEL', data: { panelId: panel.id } })
      case GridMode.CREATE:
        return this.panelFactory.select(panel, click.event.shiftKey)
      case GridMode.LINK:
        return this.linksService.addPanelToLink(click, panel)
      case GridMode.SELECT:
        return this.panelFactory.select(panel, click.event.shiftKey)
      case GridMode.DELETE:
        return this.panelFactory.delete(panel.id)
        // return this.deletePanel(panel.id)
      default:
        return this.eventFactory.error('clickPanelSwitch, default')
    }
    /*     return (
      match(gridMode)
        /*     .with(GridMode.CREATE, async () =>
    this.result.action({ action: 'SELECT_PANEL', data: { panelId: panel.id } }),
    )
        .with(GridMode.CREATE, async () => this.selectPanel(click, panel))
        .with(GridMode.LINK, async () => this.linksService.addPanelToLink(click, panel))
        .with(GridMode.SELECT, async () => this.selectPanel(click, panel))
        .with(GridMode.DELETE, async () =>
          this.result.action({ action: 'DELETE_PANEL', data: { panelId: panel.id } }),
        )
        .otherwise(async () => this.result.error('clickPanelSwitch, default'))
    ) */
  }

  private async deletePanel(panelId: string) {
    return this.eventFactory.action({ action: 'DELETE_PANEL', data: { panelId } })
  }

  private async selectPanel(click: MouseEventRequest, panel: PanelModel): Promise<GridEventResult> {
    /*     console.log(panel)
    if (panel instanceof PanelModel) {
      console.log('instance')
    }
    const panel = await this.panelsFacade.panelById(panel.id)
    if (!panel) {
      return this.result.fatal('selectPanel, !panel')
    } */
    const selectedStringId = await this.selectedFacade.selectedStringId

    if (selectedStringId && selectedStringId === panel.stringId) {
      return this.eventFactory.action({
        action: 'SELECT_PANEL_WHEN_STRING_SELECTED',
        data: { panelId: panel.id },
      })
    }

    if (click.event.shiftKey) {
      return this.eventFactory.action({ action: 'ADD_PANEL_TO_MULTISELECT', data: { panelId: panel.id } })
    }

    return this.eventFactory.action({ action: 'SELECT_PANEL', data: { panelId: panel.id } })
  }
}
