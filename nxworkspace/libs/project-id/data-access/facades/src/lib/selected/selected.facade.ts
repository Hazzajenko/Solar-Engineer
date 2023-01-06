import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { SelectedSelectors } from '@project-id/data-access/store'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class SelectedFacade {
  private store = inject(Store)

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

}
