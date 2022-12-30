import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { firstValueFrom } from 'rxjs'
import { SelectedActions } from './selected.actions'

import * as SelectedSelectors from './selected.selectors'

@Injectable({
  providedIn: 'root',
})
export class SelectedFacade {
  private readonly store = inject(Store)

  selectedId$ = this.store.select(SelectedSelectors.selectSelectedId)
  selectedIdWithType$ = this.store.select(SelectedSelectors.selectSelectedIdWithType)
  selectedStringId$ = this.store.select(SelectedSelectors.selectSelectedStringId)
  // selectedStringId = firstValueFrom(this.store.select(SelectedSelectors.selectSelectedStringId))
  selectMultiSelectIds$ = this.store.select(SelectedSelectors.selectMultiSelectIds)
  selectSelectedPositiveTo$ = this.store.select(SelectedSelectors.selectSelectedPositiveTo)
  selectSelectedNegativeTo$ = this.store.select(SelectedSelectors.selectSelectedNegativeTo)

  get selectedStringId() {
    return firstValueFrom(this.selectedStringId$)
  }

  selectPanel(panelId: string) {
    this.store.dispatch(SelectedActions.selectPanel({ panelId }))
  }

  selectMultiIds(ids: string[]) {
    this.store.dispatch(SelectedActions.selectMultiIds({ ids }))
  }

  selectPanelWhenStringSelected(panelId: string) {
    this.store.dispatch(SelectedActions.selectPanelWhenStringSelected({ panelId }))
  }

  startMultiSelectPanel(panelId: string) {
    this.store.dispatch(SelectedActions.startMultiselectPanel({ panelId }))
  }

  addPanelToMultiSelect(panelId: string) {
    this.store.dispatch(SelectedActions.addPanelToMultiselect({ panelId }))
  }

  selectString(stringId: string) {
    this.store.dispatch(SelectedActions.selectString({ stringId }))
  }

  clearSelected() {
    this.store.dispatch(SelectedActions.clearSelectedState())
  }

  clearSelectedPanelLinks() {
    this.store.dispatch(SelectedActions.clearSelectedPanelLinks())
  }
}
