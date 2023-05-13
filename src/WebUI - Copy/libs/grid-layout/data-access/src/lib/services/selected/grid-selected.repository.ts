import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { GridSelectedActions } from '../../store'
import { GridPanelModel, GridStringModel, PanelLinksToModel } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class GridSelectedRepository {
  private store = inject(Store)

  async selectPanel(panelId: string, panelLink: PanelLinksToModel) {
    // const links = await this.linksFacade.allLinks
    // const panelLink = getSelectedLinks(links, panelId)
    this.store.dispatch(GridSelectedActions.selectPanel({ panelId, panelLink }))
    // const res = await this.linkPathService.orderPanelsInLinkOrderForSelectedPanel(panelId)
    // if (!res) return
    // await this.pathsFactory.createManyPaths(res)
    // this.store.dispatch(SelectedActions.setSelectedPanelLinkPaths({ pathMap: res }))
    // this.store.dispatch(SelectedActions.setSelectedPanelLinkPaths({ pathMap: res }))
  }

  selectMultiIds(ids: string[]) {
    this.store.dispatch(GridSelectedActions.selectMultiIds({ ids }))
  }

  async selectPanelWhenStringSelected(panelId: string, panelLink: PanelLinksToModel) {
    this.store.dispatch(GridSelectedActions.selectPanelWhenStringSelected({ panelId, panelLink }))
    // const res = await this.linkPathService.orderPanelsInLinkOrderForSelectedPanel(panelId)
    // if (!res) return
    // await this.pathsFactory.createManyPaths(res)
    // this.store.dispatch(SelectedActions.setSelectedPanelLinkPaths({ pathMap: res }))
  }

  startMultiSelectPanel(panelId: string) {
    this.store.dispatch(GridSelectedActions.startMultiselectPanel({ panelId }))
  }

  addPanelToMultiSelect(panelId: string) {
    this.store.dispatch(GridSelectedActions.addPanelToMultiselect({ panelId }))
  }

  selectString(string: GridStringModel, panels: GridPanelModel[]) {
    this.store.dispatch(GridSelectedActions.selectString({ string, panels }))
  }

  clearSelected() {
    this.store.dispatch(GridSelectedActions.clearSelectedState())
  }

  clearSingleSelected() {
    this.store.dispatch(GridSelectedActions.clearSelectedSingleId())
  }

  clearSelectedPanelLinks() {
    this.store.dispatch(GridSelectedActions.clearSelectedPanelLinks())
  }
}
