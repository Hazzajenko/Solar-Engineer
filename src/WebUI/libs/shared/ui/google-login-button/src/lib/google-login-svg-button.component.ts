import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'

@Component({
  selector: 'app-google-login-svg-button',
  standalone: true,
  imports: [CommonModule],
  styles: [],
  templateUrl: './google-login-svg-button.component.html',
})
export class GoogleLoginSvgButtonComponent {
  isHover = false

  mouseEnter(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isHover = true
  }

  mouseLeave(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isHover = false
  }
}
