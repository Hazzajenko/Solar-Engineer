import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-add-project-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-project-item.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProjectItemComponent {
  style = 1
}
