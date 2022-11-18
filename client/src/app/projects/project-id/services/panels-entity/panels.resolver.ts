import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router'
import { filter, first, Observable, tap } from 'rxjs'
import { PanelsEntityService } from './panels-entity.service'

@Injectable()
export class PanelsResolver implements Resolve<boolean> {
  constructor(private panelsService: PanelsEntityService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.panelsService.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.panelsService.getAll()
        }
      }),
      filter((loaded) => !!loaded),
      first(),
    )
  }
}
