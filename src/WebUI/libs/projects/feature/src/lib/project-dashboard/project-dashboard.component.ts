import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { BaseService } from '@shared/logger'
import { ProjectsStoreService } from '@projects/data-access'
import { ProjectModel } from '@shared/data-access/models'
import { throwExpression } from '@shared/utils'
import { Router } from '@angular/router'

@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-dashboard.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDashboardComponent extends BaseService {
  private projectsStore = inject(ProjectsStoreService)
  private router = inject(Router)
  project$ = this.projectsStore.select.projectFromRoute$
  loading = false

  async routeToProject(project: ProjectModel) {
    this.loading = true
    const userName = (await this.userName) ?? throwExpression('userName is undefined')

    await this.router
      .navigateByUrl(`${userName.toLowerCase()}/${project.name}/grid-layout`)
      .then(() => {
        this.projectsStore.dispatch.initSelectProject(project.id)
        this.loading = false
      })
  }
}
