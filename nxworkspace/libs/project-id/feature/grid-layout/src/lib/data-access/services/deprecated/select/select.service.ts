/* import { inject, Injectable } from '@angular/core'
import { BlocksFacade, PanelsFacade, SelectedFacade } from '@project-id/data-access/store'
import { ProjectsFacade } from '@projects/data-access/store'
import { BlockModel, BlockType } from '@shared/data-access/models'
import { of } from 'rxjs'
import { ClickEventAction, sendClickEvent } from '../../click/utils/click.event'

@Injectable({
  providedIn: 'root',
})
export class SelectedService {
  private panelsFacade = inject(PanelsFacade)
  private blocksFacade = inject(BlocksFacade)
  private selectedFacade = inject(SelectedFacade)
  private projectsFacade = inject(ProjectsFacade)

  existingBlock(existingBlock: BlockModel) {
    if (existingBlock.type === BlockType.PANEL) {
      const event = sendClickEvent(ClickEventAction.SelectPanel, { panelId: existingBlock.id })
      return of(event)
    }

    const event = sendClickEvent(ClickEventAction.SelectPanel, { panelId: existingBlock.id })
    return of(event)
  }

  selectEvent() {
    const event = sendClickEvent(ClickEventAction.ClearSelected)
    return of(event)
  }
}
 */
