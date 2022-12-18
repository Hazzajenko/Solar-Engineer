import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { filter, first, Observable, tap } from 'rxjs'
import { PanelLinksEntityService } from './panel-links-entity.service'

@Injectable({
  providedIn: 'root',
})
export class PanelLinksResolver implements Resolve<boolean> {
  constructor(private panelLinksEntity: PanelLinksEntityService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.panelLinksEntity.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.panelLinksEntity.getAll()
        }
      }),
      filter((loaded) => !!loaded),
      first(),
    )
  }
}
