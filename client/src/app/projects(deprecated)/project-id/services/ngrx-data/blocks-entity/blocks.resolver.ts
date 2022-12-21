import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router'
import { filter, first, Observable, tap } from 'rxjs'
import { BlocksEntityService } from './blocks-entity.service'

@Injectable()
export class BlocksResolver implements Resolve<boolean> {
  constructor(private blocksEntity: BlocksEntityService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.blocksEntity.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.blocksEntity.getAll()
        }
      }),
      filter((loaded) => !!loaded),
      first(),
    )
  }
}
