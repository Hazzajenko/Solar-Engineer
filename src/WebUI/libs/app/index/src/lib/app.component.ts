import { AsyncPipe, DatePipe, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common'
import { Component, inject, OnInit, ViewChild } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav'
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
import { delay, distinctUntilChanged, map, of, tap } from 'rxjs'
import { CreateProjectOverlayComponent } from '@projects/feature'
import { DarkNavCompactComponent, DarkNavOverlapComponent } from '@shared/ui/nav-bars'
import {
  NarrowMatSidenavComponent,
  NarrowSidebarDarkComponent,
  NarrowSidebarPurpleComponent,
} from '@shared/ui/sidebars'

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
    CreateProjectOverlayComponent,
    DarkNavOverlapComponent,
    DarkNavCompactComponent,
    NarrowSidebarPurpleComponent,
    NarrowSidebarDarkComponent,
    NarrowMatSidenavComponent,
  ],
  selector: 'app-root-old',
  templateUrl: './app.component.html',
  styles: [
    `
      ::ng-deep .mat-drawer-backdrop.mat-drawer-shown {
        background-color: rgba(53, 53, 53, 0.44);
      }
    `,
  ],
})
export class AppComponent extends BaseService implements OnInit {
  title = 'web'
  @ViewChild('drawer') drawer!: MatSidenav
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

  // user$ = this.authStore.select.user$
  projects$ = this.projectsStore.select.allProjects$
  friends$ = this.friendsStoreService.select.friends$
  friendsOnline$ = this.friendsStoreService.select.friendsOnline$
  notifications$ = this.notificationsStore.select.notifications$
  // isAuthenticated$ = this.authStore.select.isAuthenticated$

  navMenu$ = this.uiStore.select.navMenuState$
  navMenuDistinct$ = this.uiStore.select.navMenuState$.pipe(
    distinctUntilChanged(),
    map((value) => {
      console.log('navMenuDistinct$', value)
      if (this.drawer) {
        this.drawer.toggle(undefined, 'keyboard').catch((e) => {
          console.log(e)
        })
      }
    }),
  )

  /*  toggleSideNav$ = this.uiStore.select.navMenuState$.pipe(
   tap((value) => (this.sideNavIsOpen = value)),
   )*/
  toggleSideNav$ = this.uiStore.select.navMenuState$.pipe(
    // tap((value) => (this.isSideNavOpen = value)),
    tap((value) => console.log('toggleSideNav$', value)),
    tap((value) => (this.drawer.opened = value)),
  )

  toggleCreateProject$ = this.uiStore.select.createProjectOverlayState$.pipe(
    tap((value) => (this.isItOpen = value)),
    tap((value) => console.log('toggleCreateProject$', value)),
  )
  createProjectOverlayState$ = this.uiStore.select.createProjectOverlayState$

  openProjectSideNav$ = of(false).pipe(
    delay(1000),
    map(() => true),
  )

  menu = false
  public sideNavExpanded = false
  // sideNavIsOpen = false
  private _sideNavIsOpen = false
  get sideNavIsOpen() {
    return this._sideNavIsOpen
  }

  set sideNavIsOpen(value) {
    if (!value) {
      this._sideNavIsOpen = value
      return
    }
    this.sideNavTimeLeft = 1
    this._sideNavIsOpen = value
    this.startSideNavTimer()
  }

  isItOpen = false
  isSideNavOpen = false

  private _createProjectIsOpen = false
  get createProjectIsOpen() {
    return this._createProjectIsOpen
  }

  set createProjectIsOpen(value) {
    if (!value) {
      this._createProjectIsOpen = value
      // this.uiStore.dispatch.toggleCreateProjectOverlay()
      // return
    } else {
      this._createProjectIsOpen = value
    }
    console.log(this._createProjectIsOpen)

    /*    this.createProjectTimeLeft = 1
     this._createProjectIsOpen = value
     this.startCreateProjectTimer()*/
  }

  get clockedInSideNav() {
    return this.sideNavTimeLeft === 0
  }

  get clockedInCreateProject() {
    return this.createProjectTimeLeft === 0
  }

  sideNavTimeLeft = 0
  createProjectTimeLeft = 0
  // clockedIn = this.timeLeft === 0

  sideNavInterval!: NodeJS.Timer
  createProjectInterval!: NodeJS.Timer

  // interval!: NodeJS.Timer

  startSideNavTimer() {
    this.sideNavInterval = setInterval(() => {
      if (this.sideNavTimeLeft > 0) {
        this.sideNavTimeLeft--
      }
    }, 100)
  }

  startCreateProjectTimer() {
    this.createProjectInterval = setInterval(() => {
      if (this.createProjectTimeLeft > 0) {
        this.createProjectTimeLeft--
      }
    }, 100)
  }

  backDropClick() {
    /*    if (this.clockedInSideNav) {
     // if (!this.sideNavIsOpen) return
     if (this.sideNavIsOpen) {
     this.sideNavIsOpen = false
     }
     // return
     }
     if (this.clockedInCreateProject) {
     // if (!this.createProjectIsOpen) return
     if (this.createProjectIsOpen) {
     this.createProjectIsOpen = false
     }
     // return
     }
     if (this.sideNavIsOpen && this.createProjectIsOpen) return
     if (!this.sideNavIsOpen) {
     this.sideNavIsOpen = true
     }
     if (!this.createProjectIsOpen) {
     this.createProjectIsOpen = true
     }*/
    // this.sideNavIsOpen = true
  }

  async backDropClickV2(event: MouseEvent) {
    console.log(event)
    event.stopPropagation()
    event.preventDefault()
    // create a delay to allow the click to propagate to the sidenav
    // and then close it
    /*
     const delay = 100
     const hi = setTimeout(() => {
     this.uiStore.dispatch.toggleNavMenu()
     }, delay)
     */

    /*    await new Promise((f) => setTimeout(f, 1000))

     firstValueFrom(this.toggleCreateProject$).then((value) => {
     if (value) {
     this.uiStore.dispatch.toggleCreateProjectOverlay()
     }
     })*/

    /*    if (this.isItOpen) {
     // this.isItOpen = false
     this.uiStore.dispatch.toggleCreateProjectOverlay()
     // return
     }*/
  }

  // sideNavProm =

  ngOnInit(): void {
    /*  this.navMenuDistinct$
     .pipe(
     map((value) => {
     console.log('navMenuDistinct$', value)
     if (this.drawer) {
     this.drawer.toggle(undefined, 'keyboard').catch((e) => {
     console.log(e)
     })
     }
     }),
     // tap((value) => (this.isSideNavOpen = value)),
     // tap((value) => console.log('toggleSideNav$', value)),
     // tap((value) => console.log('toggleSideNav$', this.drawer)),
     // tap((value) => this.drawer.toggle(value, 'keyboard')),
     )
     .subscribe()*/
    /*    this.uiStore.select.navMenuState$
     .pipe(
     // tap((value) => (this.isSideNavOpen = value)),
     tap((value) => console.log('toggleSideNav$', value)),
     tap((value) => console.log('toggleSideNav$', this.drawer)),
     tap((value) => this.drawer.toggle(value, 'keyboard')),
     )
     .subscribe()*/
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

  openedChanged(event: boolean) {
    // if (event) return
    // this.createProjectIsOpen = false
    // this.uiStore.dispatch.toggleCreateProjectOverlay()
  }

  openedChangedV2(event: boolean) {
    if (event) return
    // this.sideNavIsOpen = false
  }

  toggleMenu() {
    this.sideNavIsOpen = !this.sideNavIsOpen
  }
}
