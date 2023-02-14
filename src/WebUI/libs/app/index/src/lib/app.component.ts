import { AsyncPipe, DatePipe, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { RouterModule } from '@angular/router'
import { FriendsStoreService } from '@app/data-access/friends'
import { AuthStoreService, SignInResponseWithToken } from '@auth/data-access'
import { LetModule } from '@ngrx/component'
import { UiStoreService } from '@project-id/data-access/facades'
import { ProjectsStoreService } from '@projects/data-access/facades'
import { NotificationsStoreService } from '@shared/data-access/notifications'
import { AppBarComponent } from '@shared/ui/app-bar'

import { InitLoginPipe } from '@app/shared'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { SidenavComponent } from '@app/feature/sidenav'

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
  styles: [],
})
export class AppComponent implements OnInit {
  title = 'web'
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

  menu = false
  _token = ''
  get token() {
    return this._token
  }

  set token(token: string) {
    this._token = token
    const headerDict = {
      Authorization: `bearer ${token}`,
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    }
    this.http
      .get('/users/current', { withCredentials: true, headers: new HttpHeaders(headerDict) })
      // .pipe(catchError(() => EMPTY))
      .subscribe((res) => {
        // console.log(res)
        console.log('authorize', res)
        // /*      window.location.href = `${res}`*/
      })
  }

  ngOnInit(): void {
    this.http
      .get<SignInResponseWithToken>('/auth/authorize', { withCredentials: true })
      // .pipe(catchError(() => EMPTY))
      .subscribe((res) => {
        // console.log(res)
        console.log('authorize', res)
        this.token = res.token
        // /*      window.location.href = `${res}`*/
      })
    /*
        this.http
          .get('/users/current', { withCredentials: true })
          // .pipe(catchError(() => EMPTY))
          .subscribe((res) => {
            // console.log(res)
            console.log('authorize', res)
            // /!*      window.location.href = `${res}`*!/
          })*/
  }
}
