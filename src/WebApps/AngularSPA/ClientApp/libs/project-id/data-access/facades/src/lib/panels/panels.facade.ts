import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { LinksSelectors, PanelsSelectors, SelectedSelectors } from '@project-id/data-access/store'
import { BlockType } from '@shared/data-access/models'
import { firstValueFrom } from 'rxjs'
import { combineLatestWith, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class PanelsFacade {
  private store = inject(Store)


  loaded$ = this.store.select(PanelsSelectors.selectPanelsLoaded)
  allPanels$ = this.store.select(PanelsSelectors.selectAllPanels)
  panelsFromRoute$ = this.store.select(PanelsSelectors.selectPanelsByRouteParams)


  panelById$(id: string) {
    return this.store.select(PanelsSelectors.selectPanelById({ id }))
  }

  panelById(id: string) {
    return firstValueFrom(this.store.select(PanelsSelectors.selectPanelById({ id })))
  }

  panelsByStringId$(stringId: string) {
    return this.store.select(PanelsSelectors.selectPanelsByStringId({ stringId }))
  }

  panelsByStringId(stringId: string) {
    return firstValueFrom(this.store.select(PanelsSelectors.selectPanelsByStringId({ stringId })))
  }

  selectStringIdByPanelId$(panelId: string) {
    return this.store.select(PanelsSelectors.selectStringIdByPanelId({ panelId }))
  }

  selectedPanelId$() {
    return this.store.select(SelectedSelectors.selectSelectedIdWithType)
  }

  isSelectedNegativeTo$(id: string) {
    return this.store.select(SelectedSelectors.selectSelectedNegativeTo).pipe(
      map((selectedNegativeTo) => {
        if (selectedNegativeTo === id) {
          return true
        }
        return false
      }),
    )
  }

  isSelectedPositiveTo$(id: string) {
    return this.store.select(SelectedSelectors.selectSelectedPositiveTo).pipe(
      map((selectedPositiveTo) => {
        if (selectedPositiveTo === id) {
          return true
        }
        return false
      }),
    )
  }

  isSelectedString$(id: string) {
    return this.panelById$(id).pipe(
      map((panel) => panel?.stringId),
      combineLatestWith(this.store.select(SelectedSelectors.selectSelectedStringId)),
      map(([panelStringId, selectedStringId]) => {
        if (selectedStringId === panelStringId) {
          return true
        }
        return false
      }),
    )
  }

  isPanelToJoin$(id: string) {
    return this.store.select(LinksSelectors.selectToLinkIdWithType).pipe(
      map(({ type, toLinkId }) => {
        if (type !== BlockType.PANEL) {
          return false
        }
        if (toLinkId === id) {
          return true
        }
        return false
      }),
    )
  }
}