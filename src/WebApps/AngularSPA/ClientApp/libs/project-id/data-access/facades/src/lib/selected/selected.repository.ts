import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { SelectedActions } from '@project-id/data-access/store'
import { PanelLinksToModel, PanelModel, StringModel } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class SelectedRepository {
  private store = inject(Store)

  async selectPanel(panelId: string, panelLink: PanelLinksToModel) {
    // const links = await this.linksFacade.allLinks
    // const panelLink = getSelectedLinks(links, panelId)
    this.store.dispatch(SelectedActions.selectPanel({ panelId, panelLink }))
    // const res = await this.linkPathService.orderPanelsInLinkOrderForSelectedPanel(panelId)
    // if (!res) return
    // await this.pathsFactory.createManyPaths(res)
    // this.store.dispatch(SelectedActions.setSelectedPanelLinkPaths({ pathMap: res }))
    // this.store.dispatch(SelectedActions.setSelectedPanelLinkPaths({ pathMap: res }))
  }

  selectMultiIds(ids: string[]) {
    this.store.dispatch(SelectedActions.selectMultiIds({ ids }))
  }

  async selectPanelWhenStringSelected(panelId: string, panelLink: PanelLinksToModel) {

    this.store.dispatch(SelectedActions.selectPanelWhenStringSelected({ panelId, panelLink }))
    // const res = await this.linkPathService.orderPanelsInLinkOrderForSelectedPanel(panelId)
    // if (!res) return
    // await this.pathsFactory.createManyPaths(res)
    // this.store.dispatch(SelectedActions.setSelectedPanelLinkPaths({ pathMap: res }))
  }

  startMultiSelectPanel(panelId: string) {
    this.store.dispatch(SelectedActions.startMultiselectPanel({ panelId }))
  }

  addPanelToMultiSelect(panelId: string) {
    this.store.dispatch(SelectedActions.addPanelToMultiselect({ panelId }))
  }

  selectString(string: StringModel, panels: PanelModel[]) {
    this.store.dispatch(SelectedActions.selectString({ string, panels }))
  }

  clearSelected() {
    this.store.dispatch(SelectedActions.clearSelectedState())
  }

  clearSingleSelected() {
    this.store.dispatch(SelectedActions.clearSelectedSingleId())
  }

  clearSelectedPanelLinks() {
    this.store.dispatch(SelectedActions.clearSelectedPanelLinks())
  }
}
