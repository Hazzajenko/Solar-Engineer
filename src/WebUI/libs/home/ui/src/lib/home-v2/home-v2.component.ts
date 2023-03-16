import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatMenuModule } from '@angular/material/menu'
import {
  ProjectsCardsComponent,
  ProjectsCommandPaletteComponent,
  ProjectsHomePageComponent,
} from '@projects/feature'
import { BaseService } from '@shared/logger'
import { HOME_PAGE, HomePage } from './home-pages'
import { RouterLink } from '@angular/router'
import { UserSettingsComponent } from '@app/feature/user-settings'

@Component({
  selector: 'app-home-v2',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    ProjectsCardsComponent,
    ProjectsCommandPaletteComponent,
    ProjectsHomePageComponent,
    RouterLink,
    UserSettingsComponent,
  ],
  templateUrl: './home-v2.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeV2Component extends BaseService {
  dashBoardFinishedLoading = false
  currentPage: HomePage = HOME_PAGE.PROJECTS

  // currentPage: HomePage = HOME_PAGE.DASHBOARD

  changeHomePage(pageName: HomePage) {
    this.currentPage = pageName
  }

  /*  routeTo(page: HomePage) {
    this.changeHomePage(HOME_PAGE.SETTINGS)

  }*/
}
