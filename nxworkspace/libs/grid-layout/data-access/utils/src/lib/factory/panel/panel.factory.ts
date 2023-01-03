import { inject, Injectable } from '@angular/core'
import { GridEventResult } from '@grid-layout/data-access/actions'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { PanelsFacade, SelectedFacade } from '@project-id/data-access/facades'
import { ProjectsFacade } from '@projects/data-access/facades'
import { PanelModel } from '@shared/data-access/models'
import { combineLatest, firstValueFrom, map } from 'rxjs'
import { GridEventFactory } from '../../grid.factory'
import { toUpdatePanelArray } from '../utils/update-panel-map'

@Injectable({
  providedIn: 'root',
})
export class PanelFactory {
  private readonly eventFactory = inject(GridEventFactory)
  private readonly store = inject(Store)
  private readonly projectsFacade = inject(ProjectsFacade)
  private readonly selectedFacade = inject(SelectedFacade)
  private readonly panelsFacade = inject(PanelsFacade)

  async create(location: string, rotation: number): Promise<GridEventResult> {
    const project = await this.projectsFacade.projectFromRoute
    const selectedStringId = await this.selectedFacade.selectedStringId

    if (!project) {
      return this.eventFactory.error('project undefined')
    }
    const panel = new PanelModel({
      projectId: project.id,
      stringId: selectedStringId ? selectedStringId : 'undefined',
      location,
      rotation,
    })
    this.panelsFacade.createPanel(panel)
    this.selectedFacade.clearSingleSelected()
    return this.eventFactory.action({ action: 'CREATE_PANEL', data: { panel } })
  }

  async select(panel: PanelModel, shiftKey: boolean): Promise<GridEventResult> {
    const selectedStringId = await this.selectedFacade.selectedStringId

    if (selectedStringId && selectedStringId === panel.stringId) {
      await this.selectedFacade.selectPanelWhenStringSelected(panel.id)
      return this.eventFactory.action({
        action: 'SELECT_PANEL_WHEN_STRING_SELECTED',
        data: { panelId: panel.id },
      })
    }

    if (shiftKey) {
      this.selectedFacade.addPanelToMultiSelect(panel.id)
      return this.eventFactory.action({
        action: 'ADD_PANEL_TO_MULTISELECT',
        data: { panelId: panel.id },
      })
    }

    await this.selectedFacade.selectPanel(panel.id)
    return this.eventFactory.action({ action: 'SELECT_PANEL', data: { panelId: panel.id } })
  }

  async update(panelId: string, changes: Partial<PanelModel>): Promise<GridEventResult> {
    const update: Update<PanelModel> = {
      id: panelId,
      changes,
    }
    this.panelsFacade.updatePanel(update)

    return this.eventFactory.action({ action: 'UPDATE_PANEL', data: { update } })
  }

  async rotateSelected(rotation: number) {
    const selectedPanelIds = await firstValueFrom(
      combineLatest([this.selectedFacade.multiSelectIds$, this.panelsFacade.allPanels$]).pipe(
        map(([multiSelectIds, panels]) =>
          panels.filter((p) => multiSelectIds?.includes(p.id)).map((panels) => panels.id),
        ),
      ),
    )
    const updates = toUpdatePanelArray(selectedPanelIds, { rotation })

    this.panelsFacade.updateManyPanels(updates)

    // return this.eventFactory.action({ action: 'UPDATE_PANEL', data: { update } })
  }

  async delete(panelId: string) {
    this.panelsFacade.deletePanel(panelId)
    return this.eventFactory.action({ action: 'DELETE_PANEL', data: { panelId } })
  }
}
