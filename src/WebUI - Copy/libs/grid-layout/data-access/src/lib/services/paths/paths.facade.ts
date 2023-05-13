import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { PathsSelectors } from '../../store'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class PathsFacade {
  private store = inject(Store)

  loaded$ = this.store.select(PathsSelectors.selectPathsLoaded)
  allPaths$ = this.store.select(PathsSelectors.selectAllPaths)
  pathsFromRoute$ = this.store.select(PathsSelectors.selectPathsByRouteParams)

  selectedPanelLinkPath$ = this.store.select(PathsSelectors.selectSelectedPanelLinkPath)

  pathById$(pathId: string) {
    // if (!pathId) return of(undefined)
    return this.store.select(PathsSelectors.selectPathsById({ pathId }))
  }

  pathById(pathId: string) {
    return this.store.select(PathsSelectors.selectPathsById({ pathId }))
  }

  pathByPanelId$(panelId: string) {
    // if (!panelId) return of(undefined)
    return this.store.select(PathsSelectors.selectPathByPanelId({ panelId }))
  }

  pathByPanelId(panelId: string) {
    return this.store.select(PathsSelectors.selectPathByPanelId({ panelId }))
  }

  pathsByStringId$(stringId: string) {
    // if (!stringId) return of(undefined)
    return this.store.select(PathsSelectors.selectPathsByStringId({ stringId }))
  }

  pathsByStringId(stringId: string) {
    return firstValueFrom(this.store.select(PathsSelectors.selectPathsByStringId({ stringId })))
  }
}
