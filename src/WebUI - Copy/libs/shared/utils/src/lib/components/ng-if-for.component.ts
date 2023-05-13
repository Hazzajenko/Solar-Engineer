import { Component, Input } from '@angular/core'
import { NgForOf, NgIf } from '@angular/common'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ng-if-for',
  template: `
    <ng-container *ngIf='ngIfBool'>
      <ng-container *ngFor='let item of ngFor'>
        <!--        <ng-content></ng-content>-->
        <ng-content [ngTemplateOutlet]='item'></ng-content>
      </ng-container>
    </ng-container>
  `,
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
  ],
})

export class NgIfForComponent {
  private _ngIf = false
  private _ngFor: object[] = []
  // template ref

  // T = T

  get ngIfBool() {
    return this._ngIf
  }

  @Input() set ngIf(val: NgIfExpression) {
    console.log('ngIf', val)
    this._ngIf = !!val
  }

  get ngFor() {
    return this._ngFor
  }

  @Input() set ngFor(val: object[] | null) {
    console.log('ngFor', val)
    if (!val) return
    this._ngFor = val
  }
}

export type NgIfExpression = boolean | object | null | undefined