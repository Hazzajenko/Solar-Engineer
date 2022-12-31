import { combineLatestWith, map, share } from 'rxjs/operators'
import { of, Observable, shareReplay, firstValueFrom } from 'rxjs'
import { Update } from '@ngrx/entity'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { BlockType, PanelModel } from '@shared/data-access/models'
import {
  LinksSelectors,
  SelectedSelectors,
  PanelsSelectors,
  PanelsActions,
} from '@project-id/data-access/store'

@Injectable({
  providedIn: 'root',
})
export class PanelsFacade {
  private readonly store = inject(Store)
  private panels$!: Observable<PanelModel[]>

  loaded$ = this.store.select(PanelsSelectors.selectPanelsLoaded)
  allPanels$ = this.store.select(PanelsSelectors.selectAllPanels)
  panelsFromRoute$ = this.store.select(PanelsSelectors.selectPanelsByRouteParams)

  init(projectId: number) {
    this.store.dispatch(PanelsActions.initPanels({ projectId }))
    this.panels$ = this.store
      .select(PanelsSelectors.selectAllPanels)
      .pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  panelById$(id: string) {
    return this.store.select(PanelsSelectors.selectPanelById({ id }))
  }

  panelById(id: string) {
    return firstValueFrom(this.store.select(PanelsSelectors.selectPanelById({ id })))
  }

  panelsByStringId(stringId: string) {
    return this.store.select(PanelsSelectors.selectPanelsByStringId({ stringId }))
  }

  createPanel(panel: PanelModel) {
    this.store.dispatch(PanelsActions.addPanel({ panel }))
  }

  updatePanel(update: Update<PanelModel>) {
    this.store.dispatch(PanelsActions.updatePanel({ update }))
  }

  updatePanel$(update: Update<PanelModel>) {
    return of(PanelsActions.updatePanel({ update }))
  }

  updatePanel2$(update: Update<PanelModel>) {
    return of(this.store.dispatch(PanelsActions.updatePanel({ update })))
  }

  deletePanel(panelId: string) {
    this.store.dispatch(PanelsActions.deletePanel({ id: panelId }))
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
