import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-shared-sidenav-component',
  templateUrl: 'shared-sidenav.component.html',
  styles: [],
  imports: [CommonModule],
  standalone: true,
})
export class SharedSidenavComponent {
  style = 1
}
