import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { GridSelectors } from '../../store'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class GridFacade {
  private readonly store = inject(Store)

  gridState$ = this.store.select(GridSelectors.selectGridState)
  gridState = firstValueFrom(this.store.select(GridSelectors.selectGridState))
  gridMode$ = this.store.select(GridSelectors.selectGridMode)
  clientXY$ = this.store.select(GridSelectors.selectClientXY)
  // gridMode = firstValueFrom(this.store.select(GridSelectors.selectGridMode))
  createMode$ = this.store.select(GridSelectors.selectCreateMode)

  // createMode = firstValueFrom(this.store.select(GridSelectors.selectCreateMode))

  get createMode() {
    return firstValueFrom(this.createMode$)
  }

  get gridMode() {
    return firstValueFrom(this.gridMode$)
  }
}
