/* import { inject, Injectable } from '@angular/core'
import {
  BlocksFacade,
  GridState,
  PanelsFacade,
  SelectedFacade,
} from '@project-id/data-access/store'
import { ProjectsFacade } from '@projects/data-access/store'
import { BlockType, PanelModel } from '@shared/data-access/models'
import { combineLatest, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { sendClickEvent, ClickEventAction } from '../../click/utils/click.event'

@Injectable({
  providedIn: 'root',
})
export class CreateService {
  private panelsFacade = inject(PanelsFacade)
  private blocksFacade = inject(BlocksFacade)
  private selectedFacade = inject(SelectedFacade)
  private projectsFacade = inject(ProjectsFacade)

  createSwitch(location: string, gridState: GridState) {
    return combineLatest([of(location), of(gridState)]).pipe(
      switchMap(([location, gridState]) => {
        switch (gridState.createMode) {
          case BlockType.PANEL:
            return this.createPanelEvent(location)
          default:
            return this.errorEvent('createSwitch', 'default')
        }
      }),
    )
  }

  private createPanelEvent(location: string) {
    return combineLatest([
      of(location),
      this.selectedFacade.selectedStringId$,
      this.projectsFacade.projectFromRoute$,
    ]).pipe(
      map(([location, selectedStringId, project]) => {
        if (!project) return this.errorEvent('createPanelEvent', '!project')
        const panelRequest = new PanelModel({
          projectId: project.id,
          stringId: selectedStringId ? selectedStringId : 'undefined',
          location,
          rotation: 0,
          type: BlockType.PANEL,
        })
        const event = sendClickEvent(ClickEventAction.CreatePanel, { panel: panelRequest })
        return event
      }),
    )
  }

  private errorEvent(func: string, error: string) {
    const service = 'create'
    const event = sendClickEvent(ClickEventAction.Error, { service, func, error })
    return event
  }
}
 */
