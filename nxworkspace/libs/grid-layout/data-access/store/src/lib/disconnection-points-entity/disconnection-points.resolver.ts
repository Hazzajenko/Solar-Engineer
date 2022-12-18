import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { filter, first, Observable, tap } from 'rxjs'
import { DisconnectionPointsEntityService } from './disconnection-points-entity.service'

@Injectable({
  providedIn: 'root',
})
export class DisconnectionPointsResolver implements Resolve<boolean> {
  constructor(private disconnectionPointsEntity: DisconnectionPointsEntityService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.disconnectionPointsEntity.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.disconnectionPointsEntity.getAll()
        }
      }),
      filter((loaded) => !!loaded),
      first(),
    )
  }
}
