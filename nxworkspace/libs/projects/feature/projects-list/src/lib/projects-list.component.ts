import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '@auth/data-access/api'
import { AuthStoreService } from '@auth/data-access/facades'
import { ProjectsFacade, ProjectsStoreService } from '@projects/data-access/facades'
import { ProjectModel } from '@shared/data-access/models'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-list.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsListComponent {
  private router = inject(Router)
  private store = inject(ProjectsFacade)
  private projectsStore = inject(ProjectsStoreService)
  private authStore = inject(AuthStoreService)
  projects$: Observable<ProjectModel[] | undefined> = this.projectsStore.select.allProjects$

  routeToProject(project: ProjectModel) {
    // this.store.initSelectProject(project.id)
    this.router.navigate([`projects/${project.id}`]).then((r) => r)
  }

  async routeToProjectV2(project: ProjectModel) {
    const user = await this.authStore.select.user
    if (!user) return
    // this.store.initSelectProject(project.id)

    this.router.navigate([`${user.username}/${project.name}`]).then((r) => r)
  }
}
