import { Directive, HostListener } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { LinksStateActions } from '../projects/project-id/services/store/links/links.actions'
import { SelectedStateActions } from '../projects/project-id/services/store/selected/selected.actions'
import { GridStateActions } from '../projects/project-id/services/store/grid/grid.actions'
import { GridMode } from '../projects/project-id/services/store/grid/grid-mode.model'
import { first, firstValueFrom, switchMap } from 'rxjs'
import {
  selectIfMultiSelect,
  selectMultiSelectIds, selectSelectedPanelId,
} from '../projects/project-id/services/store/selected/selected.selectors'
import { BlocksStateActions } from '../projects/project-id/services/store/blocks/blocks.actions'
import { MultiActions } from '../projects/project-id/services/store/multi-create/multi.actions'
import { TypeModel } from '../projects/models/type.model'
import { PanelsEntityService } from '../projects/project-id/services/ngrx-data/panels-entity/panels-entity.service'
import { map } from 'rxjs/operators'

@Directive({
  selector: 'gridLayout',
  standalone: true,
})
export class GridLayoutDirective {
  constructor(private store: Store<AppState>,
              private panelsEntity: PanelsEntityService) {}

  @HostListener('window:keyup', ['$event'])
  async keyEvent(event: KeyboardEvent) {
    console.log(event)
    switch (event.key) {
      case 's':
        const isPanelSelected = await firstValueFrom(this.store.select(selectSelectedPanelId))
        if (isPanelSelected) {
          const panel = await firstValueFrom(this.panelsEntity.entities$.pipe(
            map(panels => panels.find(panel => panel.id === isPanelSelected))
          ))
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
