import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CdkDrag } from '@angular/cdk/drag-drop'
import { DesignCanvasDirective } from '../../directives'
import { select, Store } from '@ngrx/store'
import { selectDrawTime } from '../../store/canvas'

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
  private _store = inject(Store)
  public drawTime$ = this._store.pipe(select(selectDrawTime))

  ngOnInit() {
    console.log(this.constructor.name, 'ngOnInit')
  }

}
