import { Component, ContentChild } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-show-hide',
  templateUrl: './show-hide.component.html',
  styleUrls: ['./show-hide.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
  ],
})
export class ShowHideComponent {
  show = false

  @ContentChild(HTMLInputElement) input!: HTMLInputElement

  toggleShow() {
    this.show = !this.show
    // console.log(this.input)
    this.input.type = this.show ? 'text' : 'password'
  }
}
