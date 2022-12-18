import { Directive, HostListener } from '@angular/core'
import { Store } from '@ngrx/store'

import { first, firstValueFrom, switchMap } from 'rxjs'

import { map } from 'rxjs/operators'
import { AppState } from '@shared/data-access/store'
import {
  BlocksStateActions,
  GridStateActions, LinksStateActions,
  MultiActions,
  PanelsEntityService,
  SelectedStateActions, selectIfMultiSelect, selectMultiSelectIds,
  selectSelectedPanelId,
} from '@grid-layout/data-access/store'
import { GridMode } from '@shared/data-access/models'

@Directive({
  selector: 'gridLayout',
  standalone: true,
})
export class GridDirective {
  constructor(private store: Store<AppState>, private panelsEntity: PanelsEntityService) {}

  @HostListener('window:keyup', ['$event'])
  async keyEvent(event: KeyboardEvent) {
    console.log(event)
    switch (event.key) {
      case 's':
        const isPanelSelected = await firstValueFrom(this.store.select(selectSelectedPanelId))
        if (isPanelSelected) {
          const panel = await firstValueFrom(
            this.panelsEntity.entities$.pipe(
              map((panels) => panels.find((panel) => panel.id === isPanelSelected)),
            ),
          )
          if (panel) {
            this.store.dispatch(GridStateActions.changeGridmode({ mode: GridMode.SELECT }))
            this.store.dispatch(SelectedStateActions.selectString({ stringId: panel.stringId }))
          }
        }
        break
      case 'l':
        this.store.dispatch(GridStateActions.changeGridmode({ mode: GridMode.LINK }))
        break
      case 'c':
        this.store.dispatch(GridStateActions.changeGridmode({ mode: GridMode.CREATE }))
        break
      case 'Delete':
        const multiSelect = await firstValueFrom(this.store.select(selectIfMultiSelect))
        if (multiSelect) {
          const multiSelectIds = await firstValueFrom(this.store.select(selectMultiSelectIds))
          if (multiSelectIds) {
            this.store.dispatch(
              BlocksStateActions.deleteManyBlocksForGrid({ blockIds: multiSelectIds }),
            )
          }
        }
        break
      case 'Escape':
        this.store.dispatch(LinksStateActions.clearLinkState())
        this.store.dispatch(SelectedStateActions.clearSelectedState())
        this.store.dispatch(MultiActions.clearMultiState())
        this.store.dispatch(GridStateActions.changeGridmode({ mode: GridMode.SELECT }))
        break
    }
    /*    if (event.key === 'Escape') {
          this.store.dispatch(LinksStateActions.clearLinkState())
          this.store.dispatch(SelectedStateActions.clearSelectedState())
          this.store.dispatch(
            GridStateActions.changeGridmode({ mode: GridMode.CREATE }),
          )
        }*/
  }
}
