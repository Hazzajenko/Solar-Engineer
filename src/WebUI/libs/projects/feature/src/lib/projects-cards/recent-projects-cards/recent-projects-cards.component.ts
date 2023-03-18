import { CommonModule, DatePipe } from '@angular/common'
import { Router } from '@angular/router'
import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core'
import { ProjectsStoreService } from '@projects/data-access'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { Observable } from 'rxjs'
import { ProjectModel } from '@shared/data-access/models'
import { RandomNumberPipe } from '../../../../../../shared/pipes/src/lib/numbers'
import { TruncatePipe } from '@shared/pipes'
import { MatDialog } from '@angular/material/dialog'
import { CreateProjectOverlayComponent } from '@projects/feature'

@Component({
  selector: 'app-recent-projects-cards',
  standalone: true,
  imports: [CommonModule, RandomNumberPipe, TruncatePipe, MatMenuModule],
  templateUrl: './recent-projects-cards.component.html',
  styles: [],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentProjectsCardsComponent {
  private router = inject(Router)
  private projectsStore = inject(ProjectsStoreService)
  private matDialog = inject(MatDialog)
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  isHovered = new Map<string, boolean>()
  isTrue = false
  projects$: Observable<ProjectModel[] | undefined> = this.projectsStore.select.allProjects$
  pinnedProjects$: Observable<ProjectModel[] | undefined> = this.projects$
  loading = false

  async routeToProject(project: ProjectModel) {
    this.loading = true
    // await this.

    await this.router.navigate([`projects/${project.name}`]).then(() => {
      this.projectsStore.dispatch.initSelectProject(project.id)
      this.loading = false
    })
  }

  openProjectSettings(event: MouseEvent, project: ProjectModel) {
    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    this.matMenuTrigger.menuData = { project }
    this.matMenuTrigger.openMenu()
  }

  openCreateProjectDialog() {
    this.matDialog.open(CreateProjectOverlayComponent, {
      // width: '100%',
      // maxWidth: '500px',
      // height: '100%',
      // maxHeight: '500px',
      // panelClass: 'create-project-dialog',
    })
  }
}
