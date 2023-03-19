import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HOME_PAGE, HomePage } from '../home-v2/home-pages'
import { MatMenuModule } from '@angular/material/menu'
import { RouteBreadcrumbsComponent } from '@shared/ui/route-breadcrumbs'
import { BaseService } from '@shared/logger'
import { LetModule } from '@ngrx/component'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'
import { SelectThemeComponent, ThemeToggleComponent } from '@app/utils'
import { toRecord } from '@shared/utils'
import { RouteModel } from './route.model'

@Component({
  selector: 'app-home-header',
  templateUrl: 'home-header.component.html',
  imports: [
    CommonModule,
    MatMenuModule,
    RouteBreadcrumbsComponent,
    LetModule,
    RouterLink,
    RouterLinkActive,
    SelectThemeComponent,
    ThemeToggleComponent,
  ],
  styles: [],
  standalone: true,
})
export class HomeHeaderComponent extends BaseService {
  private router = inject(Router)
  currentPage: HomePage = HOME_PAGE.HOME

  routes: RouteModel[] = [
    { name: HOME_PAGE.HOME, path: '' },
    { name: HOME_PAGE.PROJECTS, path: 'projects' },
    { name: HOME_PAGE.SOCIAL, path: 'social' },
  ]
  routesRecord = toRecord(this.routes, 'name')

  changeHomePage(pageName: HomePage) {
    this.currentPage = pageName
    const path = this.routesRecord[pageName].path

    if (path === '') {
      this.router.navigate([]).catch((err) => {
        this.logError('changeHomePage', err)
      })
      return
    }

    // this.logInfo('changeHomePage', pageName)
    this.router.navigate([], { queryParams: { tab: path } }).catch((err) => {
      this.logError('changeHomePage', err)
    })
  }
}
