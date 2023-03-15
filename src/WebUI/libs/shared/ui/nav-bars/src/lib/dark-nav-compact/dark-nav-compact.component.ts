import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-dark-nav-compact',
  templateUrl: 'dark-nav-compact.component.html',
  styles: [],
  imports: [CommonModule],
  standalone: true,
})
export class DarkNavCompactComponent {
  style = 1
}
