import { Component, inject, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BaseService } from '@shared/logger'
import { RouterFacade } from '@shared/data-access/router'
import { map } from 'rxjs'
import { Router } from '@angular/router'

@Component({
  selector: 'app-route-breadcrumbs',
  templateUrl: 'route-breadcrumbs.component.html',
  styles: [],
  imports: [CommonModule],
  standalone: true,
})
export class RouteBreadcrumbsComponent extends BaseService {
  private routesFacade = inject(RouterFacade)
  private router = inject(Router)
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
      // this.logInfo(console.log && console.log.apply ? console.log.apply(console, x) : console.log(x))
      // this.logInfo(console.log, 'routeParams$', x).apply(console, x as any)
      // this.log()
      /*      const trace = new Error().stack?.split('\n')
       const logger = new Logger({ name: 'RouteBreadcrumbsComponent' })
       logger.debug('routeParams$', trace)
       const src = new Error().stack?.split('\n')?.[2].trim().split(' ')[1]
       this.logInfo(src, x)*/
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
  routeTo(route: string, urlRoutes: string[]) {
    // find the index of route in urlRoutes
    const index = urlRoutes.indexOf(route)
    // if it's not found, then route to the route
    if (index === -1) {
      this.logDebug('routeTo', route)
      this.router.navigate([route]).catch((e) => this.logError(e))
      return
    }
    // if it's found, then route to the urlRoutes up to that index
    const url = urlRoutes.slice(0, index + 1).join('/')
    this.logDebug('routeTo', url)
    this.router.navigate([url]).catch((e) => this.logError(e))

    // this.logDebug('routeTo', route)
    // this.router.navigate([route]).catch((e) => this.logError(e))
    // this.routesFacade.goToRoute(route)

  }
}
