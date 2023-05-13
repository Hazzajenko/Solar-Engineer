import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-no-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-projects.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoProjectsComponent {
  style = 1
}
