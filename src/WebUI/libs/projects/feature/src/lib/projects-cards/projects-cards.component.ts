import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatListModule } from '@angular/material/list'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { Router } from '@angular/router'
import { AuthStoreService } from '@auth/data-access'
import { ProjectsFacade, ProjectsStoreService } from '@projects/data-access'
import { ProjectModel } from '@shared/data-access/models'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-projects-cards',
  standalone: true,
  imports: [CommonModule, MatListModule, MatProgressSpinnerModule],
  templateUrl: './projects-cards.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsCardsComponent {
  private router = inject(Router)
  private store = inject(ProjectsFacade)
  private projectsStore = inject(ProjectsStoreService)
  private authStore = inject(AuthStoreService)
  projects$: Observable<ProjectModel[] | undefined> = this.projectsStore.select.allProjects$
  loading = false

  async routeToProjectV3(project: ProjectModel) {
    this.loading = true
    await this.authStore.select.isLoggedIn()

    await this.router.navigate([`projects/${project.name}`]).then(() => {
      this.projectsStore.dispatch.initSelectProject(project.id)
      this.loading = false
    })
  }
}
