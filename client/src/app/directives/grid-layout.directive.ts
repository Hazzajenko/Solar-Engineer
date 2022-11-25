import { Directive, HostListener } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { JoinsStateActions } from '../projects/store/joins/joins.actions'
import { SelectedStateActions } from '../projects/store/selected/selected.actions'

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
      this.store.dispatch(JoinsStateActions.clearPanelJoinState())
      this.store.dispatch(SelectedStateActions.clearSelectedState())
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
