import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-projects-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-settings.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsSettingsComponent {
  style = 1
}
