import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { activeButtonClasses, buttonClasses, ButtonClasses, buttonSizeClasses, ButtonSizes } from './buttons.props'
import { NgIf } from '@angular/common'

@Component({
  selector: 'app-button-builder',
  templateUrl: 'button-builder.component.html',
  styles: [],
  standalone: true,
  imports: [
    NgIf,
  ],
})
export class ButtonBuilderComponent implements OnInit {
  @Input() tone: ButtonClasses = 'Primary'
  @Input() size: ButtonSizes = 'md'
  @Input() active = true
  @Input() text!: string
  @Output() clickEvent = new EventEmitter<MouseEvent>()
  buttonStyles?: string

  ngOnInit(): void {
    if (!this.text) {
      throw new Error('Button text is required')
    }
    const buttonClass = buttonClasses[this.tone]
    if (!buttonClass) {
      throw new Error('Invalid button style')
    }
    const buttonSize = buttonSizeClasses[this.size]
    if (!buttonSize) {
      throw new Error('Invalid button size')
    }
    if (this.active) {
      this.buttonStyles = `${buttonClass}${buttonSize}${activeButtonClasses[this.tone]}`
    } else {
      this.buttonStyles = `${buttonClass}${buttonSize}`
    }
    // this.buttonStyles = `${buttonClass}${buttonSize}`
    // this.buttonStyles += activeButtonClasses[this.tone]
    // console.log(this.buttonStyles)
  }
}
