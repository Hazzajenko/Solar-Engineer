import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-voltage-drop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voltage-drop.component.html',
  styleUrls: ['./voltage-drop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoltageDropComponent {}
