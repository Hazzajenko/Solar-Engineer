import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-create-project-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-project-overlay.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProjectOverlayComponent {
  style = 1
}
