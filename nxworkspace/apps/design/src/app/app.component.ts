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
import { AuthStoreService } from '@auth/data-access'
import { LetModule } from '@ngrx/component'
import { UiStoreService } from '@project-id/data-access/facades'
import { ProjectsStoreService } from '@projects/data-access/facades'
import { NotificationsStoreService } from '@shared/data-access/notifications'
import { AppBarComponent } from '@shared/ui/app-bar'
import { NotificationsDialog } from 'libs/app/feature/notifications/src/lib/notifications.dialog'
import { SidenavComponent } from '../../../../libs/app/feature/sidenav/src/lib/sidenav.component'
import { InitLoginPipe } from '@app/shared'
import { HttpClient } from '@angular/common/http'
import { from, Observable, of } from 'rxjs'

@Component({
  standalone: true,
  imports: [
    RouterModule,
    AppBarComponent,
    MatSidenavModule,
    MatButtonModule,
    NgIf,
    AsyncPipe,
    LetModule,
    MatListModule,
    MatExpansionModule,
    NgForOf,
    MatIconModule,
    NgSwitch,
    NgSwitchCase,
    DatePipe,
    SidenavComponent,
    InitLoginPipe,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [
    `
      html,
      body {
        height: 100%;
        width: 100%;
        margin: 0px;
        padding: 0px;
      }
    `,
  ],
  // providers: [AuthFacade],
})
export class AppComponent implements OnInit {
  title = 'design'
  private authStore = inject(AuthStoreService)
  private projectsStore = inject(ProjectsStoreService)
  private friendsStoreService = inject(FriendsStoreService)
  private notificationsStore = inject(NotificationsStoreService)
  private http = inject(HttpClient)

  private uiStore = inject(UiStoreService)
  private dialog = inject(MatDialog)
  user$ = this.authStore.select.user$
  projects$ = this.projectsStore.select.allProjects$
  friends$ = this.friendsStoreService.select.friends$
  friendsOnline$ = this.friendsStoreService.select.friendsOnline$
  notifications$ = this.notificationsStore.select.notifications$
  isAuthenticated$ = this.authStore.select.isAuthenticated$

  navMenu$ = this.uiStore.select.navMenuState$
  viewProjects = false
  viewFriends = false
  viewNotifications = false
  menu = false
  // private auth = inject(AuthService)
  returningUser = true

  ngOnInit(): void {
    // successful-login
    /*    this.http.get('/auth/successful-login', { withCredentials: true }).subscribe((res) => {
          console.log(res)
          console.log('LINK', res)
          // /!*      window.location.href = `${res}`*!/
        })*/
    this.http.get('/auth/data', { withCredentials: true }).subscribe((res) => {
      console.log(res)
      console.log('LINK', res)
      // /!*      window.location.href = `${res}`*!/
    })
    this.http.get('/auth/authorize', { withCredentials: true }).subscribe((res) => {
      console.log(res)
      console.log('authorize', res)
      // /!*      window.location.href = `${res}`*!/
    })
    /*    this.http.get('http://localhost:5005/google2', { withCredentials: true }).subscribe((res) => {
          console.log(res)
          console.log('LINK', res)
          // /!*      window.location.href = `${res}`*!/
        })*/
    /*    this.http.get('/auth/login/google').subscribe((res) => {
          console.log(res)
          console.log('LINK', res)
          /!*      window.location.href = `${res}`*!/
        })
        this.http.get('/auth/google2').subscribe((res) => {
          console.log(res)
          console.log('LINK', res)
          /!*      window.location.href = `${res}`*!/
        })
        this.http.get('/auth/github').subscribe((res) => {
          console.log(res)
          console.log('LINK', res)
          /!*      window.location.href = `${res}`*!/
        })*/

    /*    this.http.get('/auth/test').subscribe((res) => {
          console.log(res)
          console.log('LINK', res)
          // window.location.href = `${res}`
        })*/
    // this.authStore.
    /*    this.uiStore.dispatch.setWindowSize({
          innerHeight: window.innerHeight,
          innerWidth: window.innerWidth,
        })*/
    /*    if (this.returningUser) {
          this.authStore.dispatch.isReturningUser()
        }*/
  }

  makeFileRequest(url: string, files: Array<File>) {
    return from(
      new Promise((resolve, reject) => {
        const formData: any = new FormData()
        const xhr = new XMLHttpRequest()
        for (const file of files) {
          formData.append('uploads[]', file, file.name)
        }
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              resolve(JSON.parse(xhr.response))
            } else {
              reject(xhr.response)
            }
          }
        }
        xhr.open('POST', url, true)
        xhr.send(formData)
      }),
    )
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
