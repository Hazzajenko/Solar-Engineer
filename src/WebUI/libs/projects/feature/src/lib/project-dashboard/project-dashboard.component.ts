import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { BaseService } from '@shared/logger'
import { ProjectsAdminService, ProjectsStoreService } from '@projects/data-access'
import { ProjectModel } from '@shared/data-access/models'
import { CreateRangePipe, DataWrapper, DialogService, GenerateUserDataPipe } from '@shared/utils'
import { Router } from '@angular/router'
import { ProjectDashboardFeedComponent } from '../project-dashboard-feed/project-dashboard-feed.component'
import { ProjectDashboardTimelineComponent } from '../project-dashboard-timeline/project-dashboard-timeline.component'
import { ButtonBuilderComponent } from '@shared/ui'
import { ProjectMembersDialogComponent } from '../project-members-dialog/project-members-dialog.component'
import { FilterByJoinedAtAndLimitPipe, ShowAdditionalMembersPipe } from '@shared/pipes'

@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  imports: [CommonModule, ProjectDashboardFeedComponent, ProjectDashboardTimelineComponent, ButtonBuilderComponent, CreateRangePipe, GenerateUserDataPipe, FilterByJoinedAtAndLimitPipe, ShowAdditionalMembersPipe],
  templateUrl: './project-dashboard.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDashboardComponent extends BaseService {
  private projectsStore = inject(ProjectsStoreService)
  private router = inject(Router)
  private projectsAdminService = inject(ProjectsAdminService)
  private dialogService = inject(DialogService)
  project$ = this.projectsStore.select.projectFromRoute$
  loading = false

  async routeToProject(project: ProjectModel) {
    this.loading = true
    const userName = await this.userName
    // const userName = (await this.userName) ?? throwExpression('userName is undefined')

    await this.routerService.navigateToProjectsGrid(userName, project)
              .then(() => {
                this.projectsStore.dispatch.initSelectProject(project.id)
                this.loading = false
              })

    /*    await this.router
     .navigateByUrl(`${userName.toLowerCase()}/${project.name}/grid-layout`)
     .then(() => {
     this.projectsStore.dispatch.initSelectProject(project.id)
     this.loading = false
     })*/
  }

  async routeToInvite(project: ProjectModel) {
    const userName = await this.userName
    await this.routerService.navigateToProjectsInvite(userName, project)
  }

  generateMembers(project: ProjectModel, amount: number) {
    this.projectsAdminService.generateProjectMembers(project.id, amount).subscribe(res => this.logDebug(res))
  }

  viewAllMembers(project: ProjectModel) {
    const data: DataWrapper<ProjectModel> = { project }
    this.dialogService.open(ProjectMembersDialogComponent, data)
  }
}
