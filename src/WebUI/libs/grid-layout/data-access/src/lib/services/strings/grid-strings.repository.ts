import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { GridStringsActions } from '../../store'
import { GridStringModel } from '@shared/data-access/models'
import { UpdateStr } from '@ngrx/entity/src/models'

@Injectable({ providedIn: 'root' })
export class GridStringsRepository {
  private store = inject(Store)

  initSelectProject(projectId: number) {
    this.store.dispatch(GridStringsActions.initStrings({ projectId }))
  }

  createString(string: GridStringModel) {
    this.store.dispatch(GridStringsActions.addString({ string }))
  }

  createStringWithPanels(string: GridStringModel, panelIds: string[]) {
    this.store.dispatch(GridStringsActions.createStringWithPanels({ string, panelIds }))
  }

  update(update: UpdateStr<GridStringModel>) {
    this.store.dispatch(GridStringsActions.updateString({ update }))
  }

  loadStringsSuccess(strings: GridStringModel[]) {
    this.store.dispatch(GridStringsActions.loadStringsSuccess({ strings }))
  }

  delete(stringId: string) {
    this.store.dispatch(GridStringsActions.deleteString({ stringId }))
  }
}
