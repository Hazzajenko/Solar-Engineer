import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ProjectsEventsComponent } from '../projects-events'

@Component({
  selector: 'app-add-project-members',
  standalone: true,
  imports: [CommonModule, ProjectsEventsComponent],
  templateUrl: './add-project-members.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProjectMembersComponent {
  style = 1
}
