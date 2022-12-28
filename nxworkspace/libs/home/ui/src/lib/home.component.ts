import { LogoNameBackgroundV2Component } from './../../../../shared/ui/logo/src/lib/logo-name-background-v2.component'
import { LogoNameBackgroundComponent } from './../../../../shared/ui/logo/src/lib/logo-name-background.component'
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { Router, RouterLink } from '@angular/router'
import { AuthFacade } from '@auth/data-access/facade'
import { ProjectsFacade } from '@projects/data-access/store'
import { ProjectsListComponent } from '@projects/feature/projects-list'
import { UserModel } from '@shared/data-access/models'
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
    LogoNameBackgroundComponent,
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
  private router = inject(Router)
  private projectsStore = inject(ProjectsFacade)

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
}
