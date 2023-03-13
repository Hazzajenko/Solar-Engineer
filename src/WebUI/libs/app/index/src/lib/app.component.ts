import { AsyncPipe, DatePipe, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { Router, RouterModule } from '@angular/router'
import { FriendsStoreService } from '@app/data-access/friends'
import { AuthStoreService } from '@auth/data-access'
import { LetModule } from '@ngrx/component'
import { UiStoreService } from '@grid-layout/data-access'
import { ProjectsStoreService } from '@projects/data-access'
import { NotificationsStoreService } from '@app/data-access/notifications'
import { AppBarComponent } from '@shared/ui/app-bar'

import { InitLoginPipe } from '@app/shared'
import { HttpClient } from '@angular/common/http'
import { SidenavComponent } from '@app/feature/sidenav'
import { RouterFacade } from '@shared/data-access/router'
import { BaseService } from '@shared/logger'
import { FooterComponent } from '@shared/ui/footer'
import { HeaderComponent } from '@shared/ui/header'

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
    FooterComponent,
    HeaderComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent extends BaseService implements OnInit {
  title = 'web'
  // private logger = inject(LoggerService)
  private authStore = inject(AuthStoreService)
  private projectsStore = inject(ProjectsStoreService)
  private friendsStoreService = inject(FriendsStoreService)
  private notificationsStore = inject(NotificationsStoreService)
  private http = inject(HttpClient)
  private routerStore = inject(RouterFacade)

  private uiStore = inject(UiStoreService)
  private dialog = inject(MatDialog)
  private router = inject(Router)

  /*
    constructor(logger: LoggerService) {
      super(logger)
    }
  */

  user$ = this.authStore.select.user$
  projects$ = this.projectsStore.select.allProjects$
  friends$ = this.friendsStoreService.select.friends$
  friendsOnline$ = this.friendsStoreService.select.friendsOnline$
  notifications$ = this.notificationsStore.select.notifications$
  isAuthenticated$ = this.authStore.select.isAuthenticated$

  navMenu$ = this.uiStore.select.navMenuState$

  menu = false

  ngOnInit(): void {
    // this.routerStore.currentRoute$.subscribe((route) => console.log(route))
    // this.routerStore.routeParams$.subscribe((params) => console.log(params))
    // this.routerStore.queryParams$.subscribe((query) => console.log(query))
    this.routerStore.queryParam$('authorize').subscribe((params) => {
      // console.log(params)
      this.logDebug('authorize', params)
      // this.logger.debug({ source: 'AppComponent', objects: ['authorize', params] })
      // this.logger
      if (params === 'true') {
        this.authStore.dispatch.authorizeRequest()
        /*        this.router
                  .navigateByUrl('')
                  .then()
                  .catch((err) => console.error(err))*/
      } else {
        this.authStore.dispatch.isReturningUser()
      }
    })
    // this.http
    //   .get('/users/current')
    //   // .pipe(catchError(() => EMPTY))
    //   .subscribe((res) => {
    //     // console.log(res)
    //     console.log('/users/current', res)
    //     // /*      window.location.href = `${res}`*/
    //   })
    // this.authStore.dispatch.isReturningUser()
    // this.authStore.dispatch.authorizeRequest()
    // this.http
    //   .get('/gateway/users/test')
    //   // .pipe(catchError(() => EMPTY))
    //   .subscribe((res) => {
    //     // console.log(res)
    //     console.log('/gateway/users/test', res)
    //     // /*      window.location.href = `${res}`*/
    //   })
  }
}
