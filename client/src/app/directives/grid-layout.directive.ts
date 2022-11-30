import { Directive, HostListener } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { LinksStateActions } from '../projects/project-id/services/store/links/links.actions'
import { SelectedStateActions } from '../projects/project-id/services/store/selected/selected.actions'
import { GridStateActions } from '../projects/project-id/services/store/grid/grid.actions'
import { GridMode } from '../projects/project-id/services/store/grid/grid-mode.model'

@Directive({
  selector: 'gridLayout',
  standalone: true,
})
export class GridLayoutDirective {
  constructor(private store: Store<AppState>) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event)
    if (event.key === 'Escape') {
      this.store.dispatch(LinksStateActions.clearLinkState())
      this.store.dispatch(SelectedStateActions.clearSelectedState())
      this.store.dispatch(
        GridStateActions.changeGridmode({ mode: GridMode.CREATE }),
      )
      /*      this.store.dispatch(
              GridStateActions.changeGridmode({ mode: GridMode.UNDEFINED }),
            )*/
      /*      this.store.select(selectGridMode).subscribe((gridMode) => {
              this.store.dispatch(JoinsStateActions.clearPanelJoinState())
              this.store.dispatch(SelectedStateActions.clearSelectedState())
              this.store.dispatch(
                GridStateActions.changeGridmode({ mode: GridMode.CREATE }),
              )
              /!*        switch (gridMode) {
                        case GridMode.JOIN:
                          return this.store.dispatch(JoinsStateActions.clearPanelJoinState())
                        case GridMode.SELECT:
                          return this.store.dispatch(
                            SelectedStateActions.clearSelectedState(),
                          )
                      }*!/
            })*/
    }
  }
}
