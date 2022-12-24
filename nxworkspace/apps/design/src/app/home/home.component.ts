import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { Router, RouterLink } from '@angular/router'
import { AuthFacade } from '@auth/data-access/facade'
import { ProjectsFacade } from '@projects/data-access/store'
import { UserModel } from '@shared/data-access/models'
import { Observable } from 'rxjs'
import { ProjectsComponent } from '../projects/projects.component'

const enterTransition = transition(':enter', [
  style({
    opacity: 0,
  }),
  animate(
    '1s ease-in',
    style({
      opacity: 1,
    }),
  ),
])

const enterTransitionV2 = transition(':enter', [
  style({
    opacity: 0,
  }),
  animate(
    '0.5s ease-in',
    style({
      opacity: 1,
    }),
  ),
])
const exitTransition = transition(':leave', [
  style({
    opacity: 1,
  }),
  animate(
    '1s ease-out',
    style({
      opacity: 0,
    }),
  ),
])
const fadeIn = trigger('fadeIn', [enterTransition])
const fadeInV2 = trigger('fadeInV2', [enterTransitionV2])
const fadeOut = trigger('fadeOut', [exitTransition])
const fadeInOut = trigger('fadeInOut', [
  state(
    'open',
    style({
      opacity: 1,
    }),
  ),
  state(
    'close',
    style({
      opacity: 0,
    }),
  ),
  transition('open => close', [animate('1s ease-out')]),
  transition('close => open', [animate('1s ease-in')]),
])

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatProgressSpinnerModule, ProjectsComponent],
  templateUrl: './home.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectsFacade],
  // viewProviders: [BrowserAnimationsModule],
  animations: [fadeInOut, fadeIn, fadeInV2],
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
