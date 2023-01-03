import { SelectedPanelVal } from 'libs/grid-layout/feature/blocks/block-panel/src/lib/models/panel-ng.model'
import { combineLatestWith, map, share } from 'rxjs/operators'
import { of, Observable, shareReplay, firstValueFrom } from 'rxjs'
import { Update } from '@ngrx/entity'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { BlockType, PanelLinkPathModel, PanelModel } from '@shared/data-access/models'
import {
  LinksSelectors,
  SelectedSelectors,
  PanelsSelectors,
  PanelsActions, SelectedActions, PathsSelectors, PathsActions,
} from '@project-id/data-access/store'

@Injectable({
  providedIn: 'root',
})
export class PathsRepository {
  private store = inject(Store)

  createPath(path: PanelLinkPathModel) {
    return this.store.dispatch(PathsActions.addPath({ path }))
  }

  createManyPaths(paths: PanelLinkPathModel[]) {
    return this.store.dispatch(PathsActions.addManyPaths({ paths }))
  }

  updatePath(update: Update<PanelLinkPathModel>) {
    return this.store.dispatch(PathsActions.updatePath({ update }))
  }

  updateManyPaths(updates: Update<PanelLinkPathModel>[]) {
    return this.store.dispatch(PathsActions.updateManyPaths({ updates }))
  }

  deletePath(pathId: string) {
    return this.store.dispatch(PathsActions.deletePath({ pathId }))
  }

  deleteManyPaths(pathIds: string[]) {
    return this.store.dispatch(PathsActions.deleteManyPaths({ pathIds }))
  }

}
