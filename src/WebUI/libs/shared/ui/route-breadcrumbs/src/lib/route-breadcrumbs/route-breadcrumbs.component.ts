import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BaseService } from '@shared/logger'

@Component({
  selector: 'app-route-breadcrumbs',
  templateUrl: 'route-breadcrumbs.component.html',
  styles: [],
  imports: [CommonModule],
  standalone: true,
})
export class RouteBreadcrumbsComponent extends BaseService {
  // routes = []
  private _routes: string[] = []
  @Input() set routes(value: string[]) {
    this.logDebug('routes', value)
    this._routes = value
  }

  get routes(): string[] {
    if (this._routes.length === 0) this._routes.push('Home')
    return this._routes
  }

  // @Input() routes!: string[]
}
