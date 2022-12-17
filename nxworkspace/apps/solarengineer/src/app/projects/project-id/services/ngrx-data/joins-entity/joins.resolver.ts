import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { filter, first, Observable, tap } from 'rxjs'
import { JoinsEntityService } from './joins-entity.service'

@Injectable()
export class JoinsResolver implements Resolve<boolean> {
  constructor(private joinsEntity: JoinsEntityService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.joinsEntity.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.joinsEntity.getAll()
        }
      }),
      filter((loaded) => !!loaded),
      first(),
    )
  }
}
