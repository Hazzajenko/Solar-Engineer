import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatMenuModule } from '@angular/material/menu'
import { RouteBreadcrumbsComponent } from '@shared/ui/route-breadcrumbs'
import { BaseService } from '@shared/logger'
import { LetModule } from '@ngrx/component'
import { ActivatedRoute, Params, Router, RouterLink, RouterLinkActive } from '@angular/router'
import { SelectThemeComponent, ThemeToggleComponent } from '@app/utils'
import { map } from 'rxjs'
import { HOME_NAV_ROUTE, HomeNavRoute, HomeNavService } from '@home/data-access'
import { ToPascalCasePipe } from '@shared/utils'
import { MenuBuilderComponent } from '@shared/ui'
import { MenuItemModel } from '../../../../../shared/ui/src/lib/menus/menu-item.model'

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
    ToPascalCasePipe,
    MenuBuilderComponent,
  ],
  styles: [],
  standalone: true,
})
export class HomeHeaderComponent extends BaseService implements OnInit, OnDestroy {

  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private homeNavService = inject(HomeNavService)
  homeNavRoute$ = this.homeNavService.route$
  // currentPage: HomePage = HOME_PAGE.HOME

  routeState$ = this.route.data.pipe(map((data) => (data as { state: string }).state))

  /*  routes: RouteModel[] = [
   { name: HOME_PAGE.HOME, path: '' },
   { name: HOME_PAGE.PROJECTS, path: 'projects' },
   { name: HOME_PAGE.SOCIAL, path: 'social' },
   ]*/

  routes: HomeNavRoute[] = [
    HOME_NAV_ROUTE.HOME,
    HOME_NAV_ROUTE.PROJECTS,
    HOME_NAV_ROUTE.SOCIAL,
  ]

  profileMenuItems: MenuItemModel[] = [
    { name: 'Profile', icon: 'person', route: 'profile' },
    { name: 'Settings', icon: 'settings', route: 'settings' },
    { name: 'Logout', icon: 'logout', route: 'logout' },
  ]
  // routesRecord = toRecord(this.routes, '')
  // routesRecord = toRecord(this.routes, 'name')

  ngOnInit(): void {
    this.logDebug('ngOnInit')
    /*    this.route.queryParamMap.subscribe((params) => {
     const tab = params.get('tab')
     if (tab) {
     this.currentPage = this.routesRecord[tab].name
     }
     })*/
    /*    this.routeState$.subscribe((state) => {
     this.logDebug('routeState$', state)
     switch (state) {
     case 'home':
     this.currentPage = HOME_PAGE.HOME
     break
     case 'projects':
     this.currentPage = HOME_PAGE.PROJECTS
     break
     case 'social':
     this.currentPage = HOME_PAGE.SOCIAL
     break
     default:
     this.currentPage = HOME_PAGE.HOME
     break
     }
     // this.currentPage = this.routesRecord[state].name
     },
     )*/
  }

  changeHomePage(pageName: HomeNavRoute) {
    // this.currentPage = pageName
    // const path = this.routesRecord[pageName].path

    /*    if (path === '') {
     /!*  this.router.navigate([]).catch((err) => {
     this.logError('changeHomePage', err)
     })*!/
     this.homeNavService.updateRoute(HOME_NAV_ROUTE.HOME)
     return
     }*/

    // this.logInfo('changeHomePage', pageName)
    // this.homeNavService.updateRoute(HOME_A)
    switch (pageName) {
      case HOME_NAV_ROUTE.HOME:
        this.homeNavService.updateRoute(HOME_NAV_ROUTE.HOME)
        this.routerNavigate('')
        // this.routerQueryParamNavigate({ tab: undefined })

        break
      case HOME_NAV_ROUTE.PROJECTS:
        this.homeNavService.updateRoute(HOME_NAV_ROUTE.PROJECTS)
        this.routerNavigate('projects')
        // this.routerQueryParamNavigate({ tab: 'projects' })
        break
      case HOME_NAV_ROUTE.SOCIAL:
        this.homeNavService.updateRoute(HOME_NAV_ROUTE.SOCIAL)
        this.routerNavigate('social')
        // this.routerQueryParamNavigate({ tab: 'social' })
        break
      default:
        this.homeNavService.updateRoute(HOME_NAV_ROUTE.HOME)
        this.routerNavigate('')
        // this.routerQueryParamNavigate({ tab: undefined })
        break
    }
    /*       this.router.navigate([], { queryParams: { tab: path } }).catch((err) => {
     this.logError('changeHomePage', err)
     })*/
  }

  routerNavigate(path: string) {
    this.router.navigate([path]).catch((err) => {
      this.logError('routerNavigate', err)
    })
  }

  routerQueryParamNavigate(queryParams: Params) {
    this.router.navigate([''], { queryParams }).catch((err) => {
      this.logError('routerQueryParamNavigate', err)
    })
  }

  ngOnDestroy(): void {
    this.logDebug('ngOnDestroy')
    // throw new Error('Method not implemented.')
  }
}
