import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CdkDrag } from '@angular/cdk/drag-drop'
import { DesignCanvasDirective } from '../../directives'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:         [
    CdkDrag,
    CommonModule,
    DesignCanvasDirective,
  ],
  selector:        'app-design-canvas',
  standalone:      true,
  styles:          [],
  templateUrl:     './design-canvas.component.html',
})
export class DesignCanvasComponent
  implements OnInit {

  ngOnInit() {
    console.log(this.constructor.name, 'ngOnInit')
  }

}
