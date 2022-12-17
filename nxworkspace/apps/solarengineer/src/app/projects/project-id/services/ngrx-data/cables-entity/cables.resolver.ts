import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { filter, first, Observable, tap } from 'rxjs'
import { CablesEntityService } from './cables-entity.service'

@Injectable()
export class CablesResolver implements Resolve<boolean> {
  constructor(private cablesEntity: CablesEntityService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.cablesEntity.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.cablesEntity.getAll()
        }
      }),
      filter((loaded) => !!loaded),
      first(),
    )

    // this.panelsService.getAll().pipe(map((panels) => !!panels))
  }
}
