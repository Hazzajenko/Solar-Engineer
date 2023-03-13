import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  imports: [CommonModule],
  styles: [],
  standalone: true,
})
export class HeaderComponent {
  style = 1
}
