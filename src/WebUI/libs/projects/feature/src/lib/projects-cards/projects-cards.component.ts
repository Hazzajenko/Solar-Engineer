import { CommonModule, DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core'
import { MatListModule } from '@angular/material/list'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { Router } from '@angular/router'
import { AuthStoreService } from '@auth/data-access'
import { ProjectsFacade, ProjectsStoreService } from '@projects/data-access'
import { ProjectModel } from '@shared/data-access/models'
import { map, Observable } from 'rxjs'
import { TimeDifferenceFromNowPipe, TruncatePipe } from '@shared/pipes'
import { NoProjectsComponent } from '../no-projects'
import { RandomNumberPipe } from '../../../../../shared/pipes/src/lib/numbers'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { CreateProjectOverlayComponent } from '../create-project-overlay'
import { MatSidenavModule } from '@angular/material/sidenav'
import { UiStoreService } from '@grid-layout/data-access'

@Component({
  selector: 'app-projects-cards',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatProgressSpinnerModule,
    TruncatePipe,
    TimeDifferenceFromNowPipe,
    NoProjectsComponent,
    RandomNumberPipe,
    MatMenuModule,
    CreateProjectOverlayComponent,
    MatSidenavModule,
  ],
  templateUrl: './projects-cards.component.html',
  styles: [],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsCardsComponent {
  private router = inject(Router)
  private store = inject(ProjectsFacade)
  private projectsStore = inject(ProjectsStoreService)
  private authStore = inject(AuthStoreService)
  private uiStore = inject(UiStoreService)
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  isHovered = new Map<string, boolean>()
  isTrue = false
  projects$: Observable<ProjectModel[] | undefined> = this.projectsStore.select.allProjects$
  loading = false

  projectsSortedByLastModifiedTime$: Observable<ProjectModel[] | undefined> =
    this.projectsStore.select.allProjects$.pipe(
      map((projects) => {
        if (!projects) return undefined
        return projects.sort((a, b) => {
          return new Date(b.lastModifiedTime).getTime() - new Date(a.lastModifiedTime).getTime()
        })
      }),
    )
  createProjectModalEnabled = false

  async routeToProject(project: ProjectModel) {
    this.loading = true
    await this.authStore.select.isLoggedIn()

    await this.router.navigate([`projects/${project.name}`]).then(() => {
      this.projectsStore.dispatch.initSelectProject(project.id)
      this.loading = false
    })
  }

  setIsTrue() {
    console.log('setIsTrue')

    this.isTrue = true
  }

  openProjectSettings(event: MouseEvent, project: ProjectModel) {
    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    this.matMenuTrigger.menuData = { project }
    this.matMenuTrigger.openMenu()
  }

  openCreateProjectModal() {
    this.uiStore.dispatch.toggleCreateProjectOverlay()
    // this.createProjectModalEnabled = true
  }
}
