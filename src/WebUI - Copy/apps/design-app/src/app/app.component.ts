import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  standalone:  true,
  selector:    'app-root',
  templateUrl: './app.component.html',
  styles:      [],
  imports:     [
    RouterOutlet,
  ],
})
export class AppComponent {
  title = 'design-app'
}
