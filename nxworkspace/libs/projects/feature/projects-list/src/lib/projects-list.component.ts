import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { AuthFacade } from '@auth/data-access/store'
import { ProjectsFacade } from '@projects/data-access/store'
import { ProjectModel, UserModel } from '@shared/data-access/models'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  private store = inject(ProjectsFacade)
  projects$: Observable<ProjectModel[] | undefined> = this.store.allProjects$
  private auth = inject(AuthFacade)
  user$: Observable<UserModel | undefined> = this.auth.user$

  routeToProject(project: ProjectModel) {}
}
