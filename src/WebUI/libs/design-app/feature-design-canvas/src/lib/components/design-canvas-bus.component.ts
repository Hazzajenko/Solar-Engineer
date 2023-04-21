import { Component, OnInit } from '@angular/core'
import { CanvasAppComponent } from './canvas-components/canvas-app.component'
import { DesignCanvasComponent } from './design-canvas/design-canvas.component'

@Component({
  selector:   'app-design-canvas-bus-component',
  template:   `
                <app-design-canvas />
                <!--                <app-canvas-app></app-canvas-app>-->
              `,
  standalone: true,
  imports:    [
    CanvasAppComponent,
    DesignCanvasComponent,
  ],
})

export class DesignCanvasBusComponent
  implements OnInit {
  ngOnInit() {
    console.log(this.constructor.name, 'ngOnInit')
  }
}