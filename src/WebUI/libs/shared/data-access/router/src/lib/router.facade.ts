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

  routeParam$(param: string) {
    return this.store.select(RouterSelectors.selectRouteNestedParam(param))
  }
}
