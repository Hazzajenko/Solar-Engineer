/* import { inject, Injectable } from '@angular/core'
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
import { ClickEventReturnType } from '../utils/events/click.event'
import { GridEventFactory } from '../utils/grid.factory'

@Injectable({
  providedIn: 'root',
})
export class LinksRepository {
  private multiFacade = inject(MultiFacade)
  private result = new GridEventFactory().clickEvents()
  private gridFacade = inject(GridFacade)
  private blocksFacade = inject(BlocksFacade)
  private selectedFacade = inject(SelectedFacade)
  private panelsFacade = inject(PanelsFacade)
  private projectsFacade = inject(ProjectsFacade)

  async selectBlock(existingBlock: BlockModel): Promise<ClickEventReturnType> {
    if (existingBlock.type === BlockType.PANEL) {
      this.selectedFacade.selectPanel(existingBlock.id)
      return this.result.action('SELECT_PANEL')
    }
    return this.result.error('selectBlock, !== PANEL')
  }

  async clearSelected(): Promise<ClickEventReturnType> {
    this.selectedFacade.clearSelected()
    return this.result.action('CLEAR_SELECTED')

  }

  async createSwitch(location: string, gridState: GridState): Promise<ClickEventReturnType> {
    switch (gridState.createMode) {
      case BlockType.PANEL:
        return this.createPanelEvent(location)

      default:
        return this.result.error('createSwitch, default')
    }
  }

  private async createPanelEvent(location: string): Promise<ClickEventReturnType> {
    const [selectedStringId, project] = await firstValueFrom(
      combineLatest([this.selectedFacade.selectedStringId$, this.projectsFacade.projectFromRoute$]),
    )
    if (!project) {
      return this.result.error('createPanelEvent, !project')
    }
    const panelRequest = new PanelModel({
      projectId: project.id,
      stringId: selectedStringId ? selectedStringId : 'undefined',
      location,
      rotation: 0,
      type: BlockType.PANEL,
    })
    this.panelsFacade.createPanel(panelRequest)
    return this.result.action('CREATE_PANEL')
  }
}
 */
