import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-new-project-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-project-home.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewProjectHomeComponent {
  style = 1
}
