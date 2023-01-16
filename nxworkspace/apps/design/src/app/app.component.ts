import { AsyncPipe, NgForOf, NgIf } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { RouterModule } from '@angular/router'
import { AuthService } from '@auth/data-access/api'
import { AuthFacade, AuthStoreService } from '@auth/data-access/facades'
import { LetModule } from '@ngrx/component'
import { UiStoreService } from '@project-id/data-access/facades'
import { ProjectsStoreService } from '@projects/data-access/facades'
import { StringModel } from '@shared/data-access/models'
import { AppBarComponent } from '@shared/ui/app-bar'
import { NotificationsDialog } from 'libs/app/feature/notifications/src/lib/notifications.dialog'
import { EditStringDialog } from 'libs/grid-layout/feature/blocks/block-panel/src/lib/dialogs/edit-string.dialog'
import { firstValueFrom } from 'rxjs'

@Component({
  standalone: true,
  imports: [RouterModule, AppBarComponent, MatSidenavModule, MatButtonModule, NgIf, AsyncPipe, LetModule, MatListModule, MatExpansionModule, NgForOf],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
  providers: [AuthFacade],
})
export class AppComponent implements OnInit {
  title = 'design'
  private authStore = inject(AuthStoreService)
  private projectsStore = inject(ProjectsStoreService)
  private uiStore = inject(UiStoreService)
  private dialog = inject(MatDialog)
  user$ = this.authStore.select.user$
  projects$ = this.projectsStore.select.allProjects$
  navMenu$ = this.uiStore.select.navMenuState$

  menu = false
  // private auth = inject(AuthService)
  returningUser = false

  ngOnInit(): void {
    // console.log(new Date().getDate().toString())
    if (this.returningUser) {
      this.authStore.dispatch.isReturningUser()
    }
  }

  openNotificationsDialog() {
    /*    const dialogConfig = new MatDialogConfig()

        dialogConfig.disableClose = true
        dialogConfig.autoFocus = true*/

    const dialogConfig = {
      disableClose: true,
      autoFocus: true,
      height: '400px',
      width: '300px',
    } as MatDialogConfig
    

    const dialog = this.dialog.open(NotificationsDialog, dialogConfig)
    /*    const result = await firstValueFrom(dialog.afterClosed())
        if (result instanceof StringModel) {
          this.snack(`Edited string ${result.name}`)
        }*/
  }

  closeDrawer() {
    this.menu = false
  }
}
