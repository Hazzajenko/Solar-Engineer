import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { getSelectedLinks, LinksPathService } from '@project-id/utils'
import { PanelModel, StringModel } from '@shared/data-access/models'
import { SelectedPanelVal } from 'libs/grid-layout/feature/blocks/block-panel/src/lib/models/panel-ng.model'
import { LinksFacade } from 'libs/project-id/data-access/facades/src/lib/links.facade'
import { singleAndMultiSelectIds } from 'libs/project-id/data-access/store/src/lib/selected/selected.selectors'
import { firstValueFrom } from 'rxjs'
import { SelectedActions, SelectedSelectors } from '@project-id/data-access/store'
import { combineLatestWith, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class SelectedFacade {
  private store = inject(Store)
  private linksFacade = inject(LinksFacade)
  private linkPathService = inject(LinksPathService)

  selectedId$ = this.store.select(SelectedSelectors.selectSelectedId)
  selectedIdWithType$ = this.store.select(SelectedSelectors.selectSelectedIdWithType)
  selectedStringId$ = this.store.select(SelectedSelectors.selectSelectedStringId)
  // selectedStringId = firstValueFrom(this.store.select(SelectedSelectors.selectSelectedStringId))
  multiSelectIds$ = this.store.select(SelectedSelectors.selectMultiSelectIds)
  singleAndMultiIds$ = this.store.select(SelectedSelectors.singleAndMultiSelectIds)

  get singleAndMultiIds() {
    return firstValueFrom(this.singleAndMultiIds$)
  }

  get multiSelectIds() {
    return firstValueFrom(this.multiSelectIds$)
  }

  selectSelectedPositiveTo$ = this.store.select(SelectedSelectors.selectSelectedPositiveTo)
  selectSelectedNegativeTo$ = this.store.select(SelectedSelectors.selectSelectedNegativeTo)
  selectedStringPathMap$ = this.store.select(SelectedSelectors.selectSelectedStringPathMap)
  selectedPanelPathMap$ = this.store.select(SelectedSelectors.selectSelectedPanelPathMap)
  selectedStringTooltip$ = this.store.select(SelectedSelectors.selectSelectedStringTooltip)

  get selectedStringId() {
    return firstValueFrom(this.selectedStringId$)
  }

  get selectedId() {
    return firstValueFrom(this.selectedId$)
  }

  async selectPanel(panelId: string) {
    const links = await this.linksFacade.allLinks
    const panelLink = getSelectedLinks(links, panelId)
    this.store.dispatch(SelectedActions.selectPanel({ panelId, panelLink }))
    const res = await this.linkPathService.orderPanelsInLinkOrderForSelectedPanel(panelId)
    if (!res) return
    this.store.dispatch(SelectedActions.setSelectedPanelLinkPaths({ pathMap: res }))
  }

  selectMultiIds(ids: string[]) {
    this.store.dispatch(SelectedActions.selectMultiIds({ ids }))
  }

  async selectPanelWhenStringSelected(panelId: string) {
    const links = await this.linksFacade.allLinks
    const panelLink = getSelectedLinks(links, panelId)
    this.store.dispatch(SelectedActions.selectPanelWhenStringSelected({ panelId, panelLink }))
    const res = await this.linkPathService.orderPanelsInLinkOrderForSelectedPanel(panelId)
    if (!res) return
    this.store.dispatch(SelectedActions.setSelectedPanelLinkPaths({ pathMap: res }))
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
