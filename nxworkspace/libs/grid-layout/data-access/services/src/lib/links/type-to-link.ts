import { inject, Injectable } from '@angular/core'
import { GridEventFactory, LinkFactory } from '@grid-layout/data-access/utils'
import {
  BlocksFacade,
  GridFacade,
  MultiFacade,
  SelectedFacade,
  PanelsFacade,
  LinksFacade,
} from '@project-id/data-access/facades'
import { ProjectsFacade } from '@projects/data-access/facades'
import {
  BlockModel,
  BlockType,
  EntityType,
  PanelLinkModel,
  PanelModel,
} from '@shared/data-access/models'
import { match, P } from 'ts-pattern'

import { GridEventResult } from '@grid-layout/data-access/actions'
import { MouseEventRequest } from '@grid-layout/shared/models'
import { LinksState } from '@project-id/shared/models'

@Injectable({
  providedIn: 'root',
})
export class TypeToLink {
  private multiFacade = inject(MultiFacade)
  private result = new GridEventFactory()
  private gridFacade = inject(GridFacade)
  private linkFactory = inject(LinkFactory)
  private selectedFacade = inject(SelectedFacade)
  private panelsFacade = inject(PanelsFacade)
  private projectsFacade = inject(ProjectsFacade)
  private linksFacade = inject(LinksFacade)

  async typeToLink(linksState: LinksState, click: MouseEventRequest, panel: PanelModel) {
    switch (linksState.typeToLink) {
      case BlockType.PANEL:
        return this.linkFactory.create(panel, linksState.toLinkId, click.event.shiftKey)
        // return this.linkPanel(click.event.shiftKey, panel, linksState.toLinkId)
      default:
        return this.result.fatal('unknown type to link')
    }
    /*     const result = await match(linksState.typeToLink)
      .with(
        BlockType.PANEL,
        async () => this.linkPanel(linksState.toLinkId, click.event.shiftKey, panel),
      )
      .otherwise(async () => this.result.fatal('unknown type to link'))
    return result */
  }

  private async linkPanel(
    shiftKey: boolean,
    panel: PanelModel,
    panelToLinkId: string | undefined,
  ): Promise<GridEventResult> {
    if (!panelToLinkId) {
      return this.result.error('!toLinkId')
    }

    return this.linkFactory.create(panel, panelToLinkId, shiftKey)
  }
}

/*
    const project = await this.projectsFacade.projectFromRoute
    if (!project) {
      return this.result.fatal('!project')
    }

    const panelToLink = await this.panelsFacade.panelById(panelToLinkId)
    if (!panelToLink) {
      return this.linkFactory.startLinkPanel(panel.id) */
/*       return this.result.action({
        action: 'START_LINK_PANEL',
        data: {
          panelId: panel.id,
        },
      }) */

/*
    const existingPanelNegativeLink = await this.linksFacade.isPanelExistingNegativeLink(panel.id)
    if (existingPanelNegativeLink) {
      return this.result.error('the panel already has a negative link')
    }

    if (panel.stringId !== panelToLink.stringId) {
      return this.result.error('both panels need to be on the same string to link')
    } */

/*

    const selectedStringId = await this.selectedFacade.selectedStringId
    if (!selectedStringId) {
      return this.result.error('need to select a string to link')
    }

    const link = new PanelLinkModel({
      projectId: project.id,
      stringId: selectedStringId,
      type: EntityType.LINK,
      positiveToId: panelToLink.id,
      negativeToId: panel.id,
    })

    return this.result.action({
      action: 'ADD_LINK',
      data: {
        link,
        shiftKey,
      },
    }) */
