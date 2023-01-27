import { AnimationEvent } from '@angular/animations'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
  RouterLink,
} from '@angular/router'
import { AuthFacade, AuthStoreService } from '@auth/data-access/facades'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import * as signalR from '@microsoft/signalr'
import { LetModule } from '@ngrx/component'
import { ProjectsFacade } from '@projects/data-access/facades'
import { ProjectsListComponent } from '@projects/feature/projects-list'
import { UserModel } from '@shared/data-access/models'
import { LogoNameBackgroundV2Component } from '@shared/ui/logo'
import { AuthDialog } from 'libs/home/ui/src/lib/dialogs/auth/auth.dialog'
import { CreateProjectDialog } from 'libs/home/ui/src/lib/dialogs/create-project/create-project.dialog'
import { ConnectionsService, ConnectionsStoreService } from '@shared/data-access/connections'
import { OnlineUsersDialog } from 'libs/home/ui/src/lib/dialogs/online-users/online-users.dialog'

import { Observable } from 'rxjs'
import { fadeIn, fadeInV2 } from './animations/animations'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatProgressSpinnerModule,
    ProjectsListComponent,
    LogoNameBackgroundV2Component,
    LetModule,
  ],
  templateUrl: './home.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectsFacade],
  // viewProviders: [BrowserAnimationsModule],
  animations: [fadeIn, fadeInV2],
})
export class HomeComponent implements OnInit {
  // user$: Observable<UserModel | undefined> = inject(AuthFacade).user$
  fade = false
  showProjects = false
  private dialog = inject(MatDialog)
  private router = inject(Router)
  private projectsStore = inject(ProjectsFacade)
  private authStore = inject(AuthStoreService)
  private connectionsService = inject(ConnectionsService)
  private connectionsStore = inject(ConnectionsStoreService)
  private hubConnection: any

  usersOnline$ = this.connectionsStore.select.connections$

  onlineUsers$ = this.connectionsService.onlineUsers$
  user$ = this.authStore.select.user$

  routerEvents$ = this.router.events

  ngOnInit(): void {
    this.connectionsService.onlineUsers$.subscribe((res) => console.log(res))
  }

  loginDevBot() {
    this.authStore.dispatch.init({
      userName: 'postmantest',
      password: 'PostmanTest1',
    })
  }

  async authenticate(login: boolean) {
    // const dialogConfig = new MatDialogConfig()
    const dialogConfig = {
      disableClose: true,
      autoFocus: true,
      data: {
        login,
      },
      height: '400px',
      width: '300px',
    } as MatDialogConfig
    /*
        dialogConfig.disableClose = true
        dialogConfig.autoFocus = true

        dialogConfig.data = {
          login,
        }

        dialogConfig.height = {
          login,
        }

        height: '400px',
          width: '600px',*/

    this.dialog.open(AuthDialog, dialogConfig)

    const user = await this.authStore.select.user
    if (user) {
      this.dialog.closeAll()
    }

    /*    // const dialog = this.dialog.open(ProfileComponent)
        const result = await firstValueFrom(dialog.afterClosed())
        // if (result instanceof StringModel) {
        //   this.snack(`Created and selected new string ${result.name}`)
        // }*/
  }

  routeToProjects() {
    // this.router.navigate(['projects']).then(() => this.projectsStore.init())
    this.showProjects = !this.showProjects
  }

  routeToLocalProject() {
    this.router.navigate(['projects/local']).then((res) => console.log(res))
    // this.showProjects = !this.showProjects
  }

  fadeInOut() {
    this.fade = !this.fade
  }

  fadeStart(event: AnimationEvent) {
    console.log(event)
  }

  fadeDone(event: AnimationEvent) {
    console.log(event)
  }

  routeToWebProject() {
    this.dialog.open(CreateProjectDialog)
  }

  instanceOfNavigationStart(routerEvents: RouterEvent | any) {
    console.log(routerEvents)
    if (routerEvents instanceof NavigationStart) {
      console.log(true)
      return true
    }
    console.log(false)
    return false
  }

  viewOnlineUsers() {
    this.dialog.open(OnlineUsersDialog)
  }
}
