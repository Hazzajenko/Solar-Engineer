import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ProjectsEventsComponent } from '../projects-events'
import { GenerateUserDataPipe } from '@shared/utils'
import { projectFromRoute } from '../project-from-route'

@Component({
  selector: 'app-add-project-members',
  standalone: true,
  imports: [CommonModule, ProjectsEventsComponent, GenerateUserDataPipe],
  templateUrl: './add-project-members.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProjectMembersComponent {
  project$ = projectFromRoute()
}
