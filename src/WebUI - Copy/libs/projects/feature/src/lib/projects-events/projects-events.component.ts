import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-projects-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-events.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsEventsComponent {
  style = 1
}
