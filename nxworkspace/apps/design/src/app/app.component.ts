import { AsyncPipe, DatePipe, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { RouterModule } from '@angular/router'
import { FriendsStoreService } from '@app/data-access/friends'
import { NotificationsDialog } from '@app/feature/notifications'
import { SidenavComponent } from '@app/feature/sidenav'
import { AuthFacade, AuthStoreService } from '@auth/data-access/facades'
import { LetModule } from '@ngrx/component'
import { UiStoreService } from '@project-id/data-access/facades'
import { ProjectsStoreService } from '@projects/data-access/facades'
import { NotificationsStoreService } from '@app/data-access/notifications'
import { AppBarComponent } from '@shared/ui/app-bar'


@Component({
  standalone: true,
  imports: [RouterModule, AppBarComponent, MatSidenavModule, MatButtonModule, NgIf, AsyncPipe, LetModule, MatListModule, MatExpansionModule, NgForOf, MatIconModule, NgSwitch, NgSwitchCase, DatePipe, SidenavComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`
    html,
    body {
      height: 100%;
      width: 100%;
      margin: 0px;
      padding: 0px
    }
  `],
  providers: [AuthFacade],
})
export class AppComponent implements OnInit {
  title = 'design'
  private authStore = inject(AuthStoreService)
  private projectsStore = inject(ProjectsStoreService)
  private friendsStoreService = inject(FriendsStoreService)
  private notificationsStore = inject(NotificationsStoreService)

  private uiStore = inject(UiStoreService)
  private dialog = inject(MatDialog)
  user$ = this.authStore.select.user$
  projects$ = this.projectsStore.select.allProjects$
  friends$ = this.friendsStoreService.select.friends$
  friendsOnline$ = this.friendsStoreService.select.friendsOnline$
  notifications$ = this.notificationsStore.select.notifications$

  navMenu$ = this.uiStore.select.navMenuState$
  viewProjects = false
  viewFriends = false
  viewNotifications = false
  menu = false
  // private auth = inject(AuthService)
  returningUser = true

  ngOnInit(): void {
    this.uiStore.dispatch.setWindowSize({
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
    })

    if (this.returningUser) {
      this.authStore.dispatch.isReturningUser()
    }
  }

  openNotificationsDialog() {
    /*    const dialogConfig = new MatDialogConfig()

        dialogConfig.disableClose = true
        dialogConfig.autoFocus = true*/

    const dialogConfig = {
      // disableClose: true,
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

  showProjects() {
    this.viewProjects = !this.viewProjects
  }

  showFriends() {
    this.viewFriends = !this.viewFriends
  }

  showNotifications() {
    this.viewNotifications = !this.viewNotifications
  }
}
