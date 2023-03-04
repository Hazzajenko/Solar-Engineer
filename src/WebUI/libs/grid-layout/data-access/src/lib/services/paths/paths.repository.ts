import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { PathsActions } from '@project-id/data-access/store'
import { SelectedPanelLinkPathModel, PathModel } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class PathsRepository {
  private store = inject(Store)

  createPath(path: PathModel) {
    return this.store.dispatch(PathsActions.addPath({ path }))
  }

  createManyPaths(paths: PathModel[]) {
    return this.store.dispatch(PathsActions.addManyPaths({ paths }))
  }

  setSelectedPanelPaths(selectedPanelLinkPath: SelectedPanelLinkPathModel) {
    return this.store.dispatch(PathsActions.setSelectedPanelLinkPaths({ selectedPanelLinkPath }))
  }

  updatePath(update: Update<PathModel>) {
    return this.store.dispatch(PathsActions.updatePath({ update }))
  }

  updateManyPaths(updates: Update<PathModel>[]) {
    return this.store.dispatch(PathsActions.updateManyPaths({ updates }))
  }

  deletePath(pathId: string) {
    return this.store.dispatch(PathsActions.deletePath({ pathId }))
  }

  deleteManyPaths(pathIds: string[]) {
    return this.store.dispatch(PathsActions.deleteManyPaths({ pathIds }))
  }


  clearSelectedPanelPaths() {
    return this.store.dispatch(PathsActions.clearSelectedPanelLinkPaths())
  }

}
