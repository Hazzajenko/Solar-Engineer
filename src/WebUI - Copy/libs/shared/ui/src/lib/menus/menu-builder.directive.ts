import { AfterViewInit, Directive, ElementRef, EventEmitter, inject, Output } from '@angular/core'
import { MenuBuilderComponent } from '@shared/ui'
import { MatMenu } from '@angular/material/menu'

@Directive({ selector: '[appMenuBuilderDirective]', standalone: true })
export class MenuBuilderDirective implements AfterViewInit {
  // private elementRef: ElementRef<MenuBuilderComponent> | undefined
  private elementRef = inject(ElementRef<MenuBuilderComponent>)
  @Output() menu = new EventEmitter<MatMenu>()

  ngAfterViewInit(): void {
    if (!this.elementRef) {
      console.error('No elementRef found')
      return
    }
    console.log(this.elementRef.nativeElement)
    console.log(this.elementRef.nativeElement.menu)
    console.log(this.elementRef.nativeElement.nonStaticMenu)
    this.menu.emit(this.elementRef.nativeElement.menu)
  }
}

