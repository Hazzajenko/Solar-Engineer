import { AnimationEvent } from '@angular/animations'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
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
import { ProjectsFacade } from '@projects/data-access/facades'
import { ProjectsListComponent } from '@projects/feature/projects-list'
import { UserModel } from '@shared/data-access/models'
import { LogoNameBackgroundV2Component } from '@shared/ui/logo'
import { AuthDialog } from 'libs/home/ui/src/lib/dialogs/auth/auth.dialog'
import { CreateProjectDialog } from 'libs/home/ui/src/lib/dialogs/create-project/create-project.dialog'

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
  ],
  templateUrl: './home.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectsFacade],
  // viewProviders: [BrowserAnimationsModule],
  animations: [fadeIn, fadeInV2],
})
export class HomeComponent {
  user$: Observable<UserModel | undefined> = inject(AuthFacade).user$
  fade = false
  showProjects = false
  private dialog = inject(MatDialog)
  private router = inject(Router)
  private projectsStore = inject(ProjectsFacade)
  private authStore = inject(AuthStoreService)

  onlineUsers$: any
  routerEvents$ = this.router.events

  async authenticate(login: boolean) {
    const dialogConfig = new MatDialogConfig()

    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true

    dialogConfig.data = {
      login,
    }

    this.dialog.open(AuthDialog, dialogConfig)

    const user = await this.authStore.select.user
    if (user) {
      this.dialog.closeAll()
    }


    /*    // const dialog = this.dialog.open(AuthDialog)
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
}
