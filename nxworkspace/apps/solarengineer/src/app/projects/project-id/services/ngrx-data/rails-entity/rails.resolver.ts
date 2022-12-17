import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { filter, first, Observable, tap } from 'rxjs'
import { RailsEntityService } from './rails-entity.service'

@Injectable()
export class RailsResolver implements Resolve<boolean> {
  constructor(private railsEntity: RailsEntityService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.railsEntity.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.railsEntity.getAll()
        }
      }),
      filter((loaded) => !!loaded),
      first(),
    )
  }
}
