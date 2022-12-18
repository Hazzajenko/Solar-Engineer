import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { filter, first, Observable, tap } from 'rxjs'
import { StringsEntityService } from './strings-entity.service'

@Injectable({
  providedIn: 'root',
})
export class StringsResolver implements Resolve<boolean> {
  constructor(private stringsEntity: StringsEntityService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.stringsEntity.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.stringsEntity.getAll()
        }
      }),
      filter((loaded) => !!loaded),
      first(),
    )
  }
}
