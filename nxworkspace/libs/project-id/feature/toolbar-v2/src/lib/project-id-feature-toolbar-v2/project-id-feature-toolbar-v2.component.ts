import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-project-id-feature-toolbar-v2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-id-feature-toolbar-v2.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectIdFeatureToolbarV2Component {}
