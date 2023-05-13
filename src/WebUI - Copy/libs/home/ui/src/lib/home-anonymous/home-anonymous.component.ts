import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatMenuModule } from '@angular/material/menu'
import {
  ProjectsCardsComponent,
  ProjectsCommandPaletteComponent,
  ProjectsHomePageComponent,
} from '@projects/feature'
import { BaseService } from '@shared/logger'
import { HOME_PAGE, HomePage } from './home-pages'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { SignInDialog } from '@auth/feature'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-home-v2',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    ProjectsCardsComponent,
    ProjectsCommandPaletteComponent,
    ProjectsHomePageComponent,
    MatButtonModule,
  ],
  templateUrl: './home-anonymous.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeAnonymousComponent extends BaseService {
  private dialog = inject(MatDialog)
  dashBoardFinishedLoading = false
  currentPage: HomePage = HOME_PAGE.DASHBOARD

  changeHomePage(pageName: HomePage) {
    this.currentPage = pageName
  }

  openSignInDialog() {
    const dialogConfig = {
      autoFocus: true,
      height: '300px',
      width: '300px',
    } as MatDialogConfig

    this.dialog.open(SignInDialog, dialogConfig)
  }
}
