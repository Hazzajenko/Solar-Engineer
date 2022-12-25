import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { ProjectsFacade } from '@projects/data-access/store'
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
  projects$: Observable<ProjectModel[] | undefined> = this.store.allProjects$

  routeToProject(project: ProjectModel) {
    this.store.initSelectProject(project.id)
    this.router.navigate([`projects/${project.id}`]).then((r) => r)
  }
}
