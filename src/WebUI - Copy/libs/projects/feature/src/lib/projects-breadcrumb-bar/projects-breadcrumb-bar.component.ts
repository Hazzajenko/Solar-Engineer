import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-projects-breadcrumbs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-breadcrumb-bar.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsBreadcrumbBarComponent {
  style = 2
}
