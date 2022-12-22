import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatSliderModule } from '@angular/material/slider'
import { FormsModule } from '@angular/forms'
import { of } from 'rxjs'

@Component({
  selector: 'app-voltage-drop',
  standalone: true,
  imports: [CommonModule, MatSliderModule, FormsModule],
  templateUrl: './voltage-drop.component.html',
  styleUrls: ['./voltage-drop.component.scss'],
})
export class VoltageDropComponent {
  length = 5
  set lengthVal(val: number) {
    this.length = val
    this.calculateVoltageDrop()
  }
  current = 5
  set currentVal(val: number) {
    this.current = val
    this.calculateVoltageDrop()
  }
  vC = 5
  set vCVal(val: number) {
    this.vC = val
    this.calculateVoltageDrop()
    // this.vD = (this.length * this.current) / this.vC
  }
  math = Math.cos(1) * 10
  vD = (this.length * this.current) / this.vC
  vD$ = of(this.vD)


  valueChanged(event: any) {
    console.log(event)
    this.vD = (this.length * this.current) / this.vC
  }

  private calculateVoltageDrop(){
    this.vD = (this.length * this.current) / this.vC
  }
}
