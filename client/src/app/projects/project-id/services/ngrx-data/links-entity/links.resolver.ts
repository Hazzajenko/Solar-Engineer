import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router'
import { filter, first, Observable, tap } from 'rxjs'
import { LinksEntityService } from './links-entity.service'

@Injectable()
export class LinksResolver implements Resolve<boolean> {
  constructor(private linksEntity: LinksEntityService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.linksEntity.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.linksEntity.getAll()
        }
      }),
      filter((loaded) => !!loaded),
      first(),
    )
  }
}
