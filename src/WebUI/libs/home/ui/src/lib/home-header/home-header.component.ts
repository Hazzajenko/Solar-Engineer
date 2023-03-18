import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HOME_PAGE, HomePage } from '../home-v2/home-pages'
import { MatMenuModule } from '@angular/material/menu'
import { RouteBreadcrumbsComponent } from '@shared/ui/route-breadcrumbs'
import { BaseService } from '@shared/logger'
import { LetModule } from '@ngrx/component'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'
import { SelectThemeComponent, ThemeToggleComponent } from '@app/utils'

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

  routes = [
    { name: HOME_PAGE.HOME, path: HOME_PAGE.HOME },
    { name: HOME_PAGE.PROFILE, path: HOME_PAGE.PROFILE },
    { name: HOME_PAGE.SOCIAL, path: HOME_PAGE.SOCIAL },
  ]

  // @Input() user!: AuthUserModel

  changeHomePage(pageName: HomePage) {
    this.currentPage = pageName
    /*    this.router.navigate([pageName]).catch((err) => {
      this.logError('changeHomePage', err)
    }*/
  }
}
