import { Directive, ElementRef, Input } from '@angular/core'

@Directive({
  selector: 'blockDirective',
  standalone: true,
})
export class BlockDirective {
  @Input() id!: string

  constructor(private elRef: ElementRef) {
    /*    if (this.data) {
          if (this.data.panel) {
            if (this.data.panelsToJoin) {
              if (this.data.panelsToJoin.includes(this.data.panel)) {
                this.elRef.nativeElement.style.backgroundColor = '#07ffd4'
              }
            }
          }
        }*/
  }
}
