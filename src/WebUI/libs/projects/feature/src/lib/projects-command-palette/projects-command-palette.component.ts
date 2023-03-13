import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-projects-command-palette',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-command-palette.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsCommandPaletteComponent {
  style = 1
}
