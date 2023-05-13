import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-center-feature',
  templateUrl: './center-feature.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  standalone: true,
})
export class CenterFeatureComponent {}
