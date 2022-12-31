import { Directive, HostListener, inject } from '@angular/core'
import { GridFacade, MultiFacade } from '@project-id/data-access/store'
import { firstValueFrom } from 'rxjs'

@Directive({
  selector: '[appKeyMap]',
  standalone: true,
})
export class KeyMapDirective {
  private gridFacade = inject(GridFacade)

  private multiFacade = inject(MultiFacade)

  @HostListener('window:keyup', ['$event'])
  async keyEvent(event: KeyboardEvent) {
    console.log(event)
    switch (event.key) {
      case 'Alt':
        {
          const multiState = await firstValueFrom(this.multiFacade.state$)
          if (multiState.locationStart && event.key === 'Alt') {
            this.multiFacade.clearMultiState()
          }
        }
        break
      /*       case 's':
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
        break */
      case 'l':
        this.gridFacade.selectLinkMode()
        break
      case 'c':
        this.gridFacade.selectCreateMode()
        break
      /*       case 'Delete':
        const multiSelect = await firstValueFrom(this.store.select(selectIfMultiSelect))
        if (multiSelect) {
          const multiSelectIds = await firstValueFrom(this.store.select(selectMultiSelectIds))
          if (multiSelectIds) {
            this.store.dispatch(
              BlocksStateActions.deleteManyBlocksForGrid({ blockIds: multiSelectIds }),
            )
          }
        }
        break */
      case 'Escape':
        this.gridFacade.clearEntireGridState()
        break
    }
  }
}
