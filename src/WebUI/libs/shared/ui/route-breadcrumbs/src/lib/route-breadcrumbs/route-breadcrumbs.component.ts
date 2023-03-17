import { Component, inject, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BaseService } from '@shared/logger'
import { RouterFacade } from '@shared/data-access/router'
import { map } from 'rxjs'

@Component({
  selector: 'app-route-breadcrumbs',
  templateUrl: 'route-breadcrumbs.component.html',
  styles: [],
  imports: [CommonModule],
  standalone: true,
})
export class RouteBreadcrumbsComponent extends BaseService {
  private routesFacade = inject(RouterFacade)
  // routes = []
  private _routes: string[] = []
  routeParams$ = this.routesFacade.routeParams$

  urlRoutes$ = this.routesFacade.routeUrls$.pipe(map((x) => x.map((y) => y.path)))

  @Input() set routes(value: string[]) {
    this.logDebug('routes', value)
    this._routes = value
  }

  get routes(): string[] {
    if (this._routes.length === 0) this._routes.push('Home')
    return this._routes
  }

  constructor() {
    super()
    this.routesFacade.routeParams$.subscribe((x) => {
      this.logDebug('routeParams$', x)
    })
    this.routesFacade.routeUrls$.subscribe((x) => {
      this.logDebug('routeUrls$', x)
    })
    this.routesFacade.selectCurrentRoute$.subscribe((x) => {
      this.logDebug('selectCurrentRoute$', x)
    })
    this.routesFacade.selectUrl$.subscribe((x) => {
      this.logDebug('selectUrl$', x)
    })
  }

  // @Input() routes!: string[]
}
