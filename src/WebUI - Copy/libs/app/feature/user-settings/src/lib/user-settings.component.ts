import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { BaseService } from '@shared/logger'

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  standalone: true,
})
export class UserSettingsComponent extends BaseService {}
