import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  standalone: true,
})
export class UserSettingsComponent {}
