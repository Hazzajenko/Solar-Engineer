import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { SelectedSelectors } from '../../store'
import { firstValueFrom, map, switchMap } from 'rxjs'
import { PanelsFacade } from '../panels'

@Injectable({
  providedIn: 'root',
})
export class SelectedFacade {
  private store = inject(Store)
  private panelsFacade = inject(PanelsFacade)

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

  multiSelectPanelIds$() {
    return this.multiSelectIds$.pipe(
      switchMap((multiSelectIds) => {
        return this.panelsFacade.allPanels$.pipe(
          map((panels) => {
            if (multiSelectIds && multiSelectIds.length > 0) {
              return panels
                .filter((panel) => multiSelectIds?.includes(panel.id))
                .map((panels) => panels.id)
            }
            return undefined
          }),
        )
      }),
    )
  }

  async multiSelectPanelIds() {
    return await firstValueFrom(this.multiSelectPanelIds$())
  }
}
