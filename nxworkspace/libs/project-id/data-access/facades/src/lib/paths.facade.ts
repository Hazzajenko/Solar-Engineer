import { SelectedPanelVal } from 'libs/grid-layout/feature/blocks/block-panel/src/lib/models/panel-ng.model'
import { selectPathByPanelId } from 'libs/project-id/data-access/store/src/lib/paths/paths.selectors'
import { combineLatestWith, map, share } from 'rxjs/operators'
import { of, Observable, shareReplay, firstValueFrom } from 'rxjs'
import { Update } from '@ngrx/entity'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { BlockType, PanelModel } from '@shared/data-access/models'
import {
  LinksSelectors,
  SelectedSelectors,
  PanelsSelectors,
  PanelsActions, SelectedActions, PathsSelectors,
} from '@project-id/data-access/store'

@Injectable({
  providedIn: 'root',
})
export class PathsFacade {
  private store = inject(Store)


  loaded$ = this.store.select(PathsSelectors.selectPathsLoaded)
  allPaths$ = this.store.select(PathsSelectors.selectAllPaths)
  pathsFromRoute$ = this.store.select(PathsSelectors.selectPathsByRouteParams)


  pathById$(pathId: string | undefined) {
    if (!pathId) return of(undefined)
    return this.store.select(PathsSelectors.selectPathsById({ pathId }))
  }

  pathById(pathId: string) {
    return this.store.select(PathsSelectors.selectPathsById({ pathId }))
  }

  pathByPanelId$(panelId: string | undefined) {
    if (!panelId) return of(undefined)
    return this.store.select(PathsSelectors.selectPathByPanelId({ panelId }))
  }

  pathByPanelId(panelId: string) {
    return this.store.select(PathsSelectors.selectPathByPanelId({ panelId }))
  }


  pathByStringId$(stringId: string | undefined) {
    if (!stringId) return of(undefined)
    return this.store.select(PathsSelectors.selectPathsByStringId({ stringId }))
  }

  pathByStringId(stringId: string) {
    return this.store.select(PathsSelectors.selectPathsByStringId({ stringId }))
  }

}
