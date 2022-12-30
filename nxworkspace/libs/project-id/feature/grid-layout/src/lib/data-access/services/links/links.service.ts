import { inject, Injectable } from '@angular/core'
import {
  BlocksFacade,
  GridFacade,
  LinksFacade,
  MultiFacade,
  PanelsFacade,
  SelectedFacade,
} from '@project-id/data-access/store'
import { ProjectsFacade } from '@projects/data-access/store'
import {
  BlockModel,
  BlockType,
  EntityType,
  PanelLinkModel,
  PanelModel,
} from '@shared/data-access/models'
import { combineLatest, firstValueFrom } from 'rxjs'
import { match } from 'ts-pattern'
import { MouseEventRequest } from '../utils/events/mouse.event'
import { GridEventFactory, GridEventResult } from '../utils/grid.factory'
import { LinksEventResult } from './links.factory'
import { LinksRepository } from './links.repository'

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  private multiFacade = inject(MultiFacade)
  private result = new GridEventFactory().linksEvents()
  private gridFacade = inject(GridFacade)
  private blocksFacade = inject(BlocksFacade)
  private selectedFacade = inject(SelectedFacade)
  private panelsFacade = inject(PanelsFacade)
  private projectsFacade = inject(ProjectsFacade)
  private linksFacade = inject(LinksFacade)
  private linksRepository = inject(LinksRepository)

  async addPanelToLink(click: MouseEventRequest, block: BlockModel): Promise<GridEventResult> {
    /*     const [linksState, panel] = await firstValueFrom(
      combineLatest([this.linksFacade.state$, this.panelsFacade.panelById$(block.id)]),
    ) */
    const linksState = await this.linksFacade.state
    const panel = await this.panelsFacade.panelById(block.id)
    if (!panel) {
      // this.gridFacade.clearEntireGridState()
      return this.linksRepository.updateState(
        this.result.action({ action: 'CLEAR_GRID_STATE', data: { log: 'addPanelToJoin !panel' } }),
      )
    }
    if (panel.stringId === 'undefined') {
      return this.linksRepository.updateState(
        this.result.action({
          action: 'CLEAR_GRID_STATE',
          data: { log: 'panel needs to be apart of a string' },
        }),
      )
    }

    if (linksState?.typeToLink === undefined || linksState?.toLinkId === undefined) {
      const existingPanelPositiveLink = await this.linksFacade.isPanelExistingPositiveLink(panel.id)

      if (existingPanelPositiveLink) {
        return this.linksRepository.updateState(
          this.result.error('this panel already has a positive link'),
        )
      }
      return this.linksRepository.updateState(
        this.result.action({ action: 'START_LINK_PANEL', data: { panelId: panel.id } }),
      )
    }

    const result = await match(linksState.typeToLink)
      .with(
        BlockType.PANEL,
        async () => await this.linkPanel(linksState.toLinkId, click.event.shiftKey, panel),
      )
      .otherwise(async () => this.result.fatal('unknown type to link'))
    return this.linksRepository.updateState(result)
  }

  private async linkPanel(
    toLinkId: string | undefined,
    shiftKey: boolean,
    panel: PanelModel,
  ): Promise<LinksEventResult> {
    if (!toLinkId) {
      return this.result.error('!toLinkId')
    }

    const project = await this.projectsFacade.projectFromRoute
    if (!project) {
      return this.result.fatal('!project')
    }

    const panelToLink = await this.panelsFacade.panelById(toLinkId)
    if (!panelToLink) {
      return this.result.action({
        action: 'START_LINK_PANEL',
        data: {
          panelId: panel.id,
        },
      })
    }

    const existingPanelNegativeLink = await this.linksFacade.isPanelExistingNegativeLink(panel.id)
    if (existingPanelNegativeLink) {
      return this.result.error('the panel already has a negative link')
    }

    if (panel.stringId !== panelToLink.stringId) {
      return this.result.error('both panels need to be on the same string to link')
    }

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
    })
  }
}
