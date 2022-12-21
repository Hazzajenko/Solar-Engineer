import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router'
import { filter, first, Observable, tap } from 'rxjs'
import { TrackersEntityService } from './trackers-entity.service'

@Injectable()
export class TrackersResolver implements Resolve<boolean> {
  constructor(private trackersEntity: TrackersEntityService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.trackersEntity.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.trackersEntity.getAll()
        }
      }),
      filter((loaded) => !!loaded),
      first(),
    )
  }
}
