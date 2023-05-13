import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { BlocksSelectors } from '../../store'
import { firstValueFrom, map, switchMap } from 'rxjs'
import { ProjectsSelectors } from '@projects/data-access'

@Injectable({
  providedIn: 'root',
})
export class BlocksFacade {
  private readonly store = inject(Store)

  loaded$ = this.store.select(BlocksSelectors.selectBlocksLoaded)
  allBlocks$ = this.store.select(BlocksSelectors.selectAllBlocks)
  blocksFromRoute$ = this.store.select(BlocksSelectors.selectBlocksByProjectIdRouteParams)

  // blocksFromProject$ = this.store.select(BlocksSelectors.selectBlocksByProjectNameRouteParams)

  blocksFromProject$() {
    return this.store.select(ProjectsSelectors.selectProjectByNameRouteParams).pipe(switchMap((project) =>
      this.store.select(BlocksSelectors.selectBlocksByProjectId({ projectId: project ? project.id : '' }))))
    // return this.store.select(BlocksSelectors.selectBlocksByProjectNameRouteParams)
  }

  blockById(id: string) {
    return this.store.select(BlocksSelectors.selectBlockById({ id }))
  }

  blockByLocation$(location: string) {
    return this.store.select(BlocksSelectors.selectBlockByLocation({ location }))
  }

  blockByLocation(location: string) {
    return firstValueFrom(this.store.select(BlocksSelectors.selectBlockByLocation({ location })))
  }

  async anyBlocksInArray(locationArray: string[]) {
    return firstValueFrom(
      this.allBlocks$.pipe(
        map((blocks) => blocks.filter((block) => locationArray.includes(block.location))),
      ),
    )
  }

  selectBlocksFromArray(locationArray: string[]) {
    return this.store.select(BlocksSelectors.selectBlockIdsFromArray({ locationArray }))
  }

  selectBlockIdsFromArray$(locationArray: string[]) {
    return this.store.select(BlocksSelectors.selectBlockIdsFromArray({ locationArray }))
  }

  selectBlockIdsFromArray(locationArray: string[]) {
    return firstValueFrom(
      this.store.select(BlocksSelectors.selectBlockIdsFromArray({ locationArray })),
    )
  }
}
