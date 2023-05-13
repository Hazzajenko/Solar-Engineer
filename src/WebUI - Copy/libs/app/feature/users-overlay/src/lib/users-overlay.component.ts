import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-users-overlay',
  templateUrl: './users-overlay.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  standalone: true,
})
export class UsersOverlayComponent {}
