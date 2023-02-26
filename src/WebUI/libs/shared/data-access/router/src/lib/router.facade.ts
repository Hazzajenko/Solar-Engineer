import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { RouterSelectors } from '..'

@Injectable({
  providedIn: 'root',
})
export class RouterFacade {
  private store = inject(Store)

  routeParams$ = this.store.select(RouterSelectors.selectRouteParams)
  currentRoute$ = this.store.select(RouterSelectors.selectCurrentRoute)
  queryParams$ = this.store.select(RouterSelectors.selectQueryParams)

  // queryParam$ = this.store.select(RouterSelectors.selectQueryParam)

  routeParam$(param: string) {
    return this.store.select(RouterSelectors.selectRouteNestedParam(param))
  }

  queryParam$(param: string) {
    return this.store.select(RouterSelectors.selectQueryParam(param))
  }
}
