import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HOME_PAGE, HomePage } from '../home-v2/home-pages'
import { MatMenuModule } from '@angular/material/menu'
import { AuthUserModel } from '@shared/data-access/models'
import { RouteBreadcrumbsComponent } from '@shared/ui/route-breadcrumbs'

@Component({
  selector: 'app-home-header',
  templateUrl: 'home-header.component.html',
  imports: [CommonModule, MatMenuModule, RouteBreadcrumbsComponent],
  styles: [],
  standalone: true,
})
export class HomeHeaderComponent {
  currentPage: HomePage = HOME_PAGE.PROJECTS
  @Input() user!: AuthUserModel

  changeHomePage(pageName: HomePage) {
    this.currentPage = pageName
  }
}
