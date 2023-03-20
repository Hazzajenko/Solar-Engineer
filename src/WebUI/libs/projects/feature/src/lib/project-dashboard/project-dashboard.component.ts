import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { BaseService } from '@shared/logger'
import { ProjectsStoreService } from '@projects/data-access'
import { ProjectModel } from '@shared/data-access/models'
import { CreateRangePipe, GenerateUserDataPipe, throwExpression } from '@shared/utils'
import { Router } from '@angular/router'
import { ProjectDashboardFeedComponent } from '../project-dashboard-feed/project-dashboard-feed.component'
import { ProjectDashboardTimelineComponent } from '../project-dashboard-timeline/project-dashboard-timeline.component'
import { ButtonBuilderComponent } from '@shared/ui'

@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  imports: [CommonModule, ProjectDashboardFeedComponent, ProjectDashboardTimelineComponent, ButtonBuilderComponent, CreateRangePipe, GenerateUserDataPipe],
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
