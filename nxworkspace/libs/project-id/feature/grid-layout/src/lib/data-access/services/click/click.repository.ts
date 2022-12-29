import { inject, Injectable } from '@angular/core'
import {
  BlocksFacade,
  GridFacade,
  GridState,
  MultiFacade,
  PanelsFacade,
  SelectedFacade,
} from '@project-id/data-access/store'
import { ProjectsFacade } from '@projects/data-access/store'
import { BlockModel, BlockType, PanelModel } from '@shared/data-access/models'
import { combineLatest, firstValueFrom } from 'rxjs'

import { ClickEventReturn } from './utils/click.event'

@Injectable({
  providedIn: 'root',
})
export class ClickRepository {
  private multiFacade = inject(MultiFacade)

  private gridFacade = inject(GridFacade)
  private blocksFacade = inject(BlocksFacade)
  private selectedFacade = inject(SelectedFacade)
  private panelsFacade = inject(PanelsFacade)
  private projectsFacade = inject(ProjectsFacade)

  async selectBlock(existingBlock: BlockModel): Promise<ClickEventReturn> {
    if (existingBlock.type === BlockType.PANEL) {
      this.selectedFacade.selectPanel(existingBlock.id)
      return new ClickEventReturn({ action: 'SELECT_PANEL', result: true })
    }
    return new ClickEventReturn({
      action: 'SELECT_PANEL',
      result: false,
      error: 'selectBlock, !== PANEL',
    })
  }

  async clearSelected(): Promise<ClickEventReturn> {
    this.selectedFacade.clearSelected()
    return new ClickEventReturn({ action: 'CLEAR_SELECTED', result: true })
  }

  async createSwitch(location: string, gridState: GridState): Promise<ClickEventReturn> {
    switch (gridState.createMode) {
      case BlockType.PANEL:
        return this.createPanelEvent(location)

      default:
        return new ClickEventReturn({
          action: 'CREATE_SWITCH',
          result: false,
          error: 'createSwitch, default',
        })
    }
  }

  private async createPanelEvent(location: string): Promise<ClickEventReturn> {
    const [selectedStringId, project] = await firstValueFrom(
      combineLatest([this.selectedFacade.selectedStringId$, this.projectsFacade.projectFromRoute$]),
    )
    if (!project) {
      return new ClickEventReturn({
        action: 'CREATE_PANEL',
        result: false,
        error: 'createPanelEvent, !project',
      })
    }
    const panelRequest = new PanelModel({
      projectId: project.id,
      stringId: selectedStringId ? selectedStringId : 'undefined',
      location,
      rotation: 0,
      type: BlockType.PANEL,
    })
    this.panelsFacade.createPanel(panelRequest)
    return new ClickEventReturn({ action: 'CREATE_PANEL', result: true })
  }
}
