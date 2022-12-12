import { Directive, HostListener } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { LinksStateActions } from '../projects/project-id/services/store/links/links.actions'
import { SelectedStateActions } from '../projects/project-id/services/store/selected/selected.actions'
import { GridStateActions } from '../projects/project-id/services/store/grid/grid.actions'
import { GridMode } from '../projects/project-id/services/store/grid/grid-mode.model'
import { firstValueFrom } from 'rxjs'
import {
  selectIfMultiSelect,
  selectMultiSelectIds,
} from '../projects/project-id/services/store/selected/selected.selectors'
import { BlocksStateActions } from '../projects/project-id/services/store/blocks/blocks.actions'

@Directive({
  selector: 'gridLayout',
  standalone: true,
})
export class GridLayoutDirective {
  constructor(private store: Store<AppState>) {}

  @HostListener('window:keyup', ['$event'])
  async keyEvent(event: KeyboardEvent) {
    console.log(event)
    switch (event.key) {
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
        this.store.dispatch(GridStateActions.changeGridmode({ mode: GridMode.CREATE }))
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
