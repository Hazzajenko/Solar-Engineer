import { inject, Injectable } from '@angular/core'
import { RouterFacade } from '@shared/data-access/router'
import { BehaviorSubject } from 'rxjs'
import { HOME_NAV_ROUTE, HomeNavRoute } from '../models/home-nav.route'

@Injectable({
  providedIn: 'root',
})
export class HomeNavService {
  private routerFacade = inject(RouterFacade)
  private _route$ = new BehaviorSubject<HomeNavRoute>(HOME_NAV_ROUTE.HOME)
  route$ = this._route$.asObservable()

  updateRoute(route: HomeNavRoute) {
    this._route$.next(route)
  }
}