import { Component, inject, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core'
import { CanvasComponent } from './canvas.component'
import { CanvasEntity, createPanel, eventToPointLocation, TransformedPoint } from '@design-app/feature-design-canvas'
import { CtxPanelComponent } from './ctx-panel.component'
import { NgForOf } from '@angular/common'

@Component({
  selector:   'app-canvas-app',
  template:   `
                <app-canvas #app>

                  <app-ctx-panel [ctx]='app.ctx'
                                 [panel]='panel'
                                 *ngFor='let panel of panels'></app-ctx-panel>
                </app-canvas>
              `,
  standalone: true,
  imports:    [
    CanvasComponent,
    CtxPanelComponent,
    NgForOf,
  ],
})

export class CanvasAppComponent
  implements OnInit {
  @ViewChild(CanvasComponent) private _canvas!: CanvasComponent
  @ViewChildren(CtxPanelComponent) private _ctxPanels: QueryList<CtxPanelComponent> = new QueryList<CtxPanelComponent>()
  private _renderer = inject(Renderer2)
  panels: CanvasEntity[] = []

  ngOnInit() {
    console.log(this.constructor.name, 'ngOnInit')
    this._renderer.listen(window, 'click', (event: MouseEvent) => {
      this.addPanel(event)
    })
    this.animate60Fps()
  }

  animate60Fps() {
    const fps = 60
    const interval = 1000 / fps
    let then = Date.now()
    let now = then
    const delta = now - then
    const step = () => {
      requestAnimationFrame(step)
      now = Date.now()
      const delta = now - then
      if (delta > interval) {
        then = now - (delta % interval)
        this.draw()
      }
    }
    requestAnimationFrame(step)
  }

  draw() {
    this._canvas.ctx.clearRect(0, 0, this._canvas.canvasEl.width, this._canvas.canvasEl.height)
    this._ctxPanels.forEach((ctxPanel) => ctxPanel.drawWithCtx(this._canvas.ctx))
    // this._ctxPanels.forEach((ctxPanel) => ctxPanel.draw())
    // console.log('draw')
  }

  public addPanel(event: MouseEvent) {
    /*    const location = {
     x: event.offsetX,
     y: event.offsetY,
     }*/
    const location = this.getTransformedPointFromEvent(event)
    const panel = createPanel(location)
    this.panels.push(panel)
    console.log(this.panels)
    console.log(this._ctxPanels)
    const toArray = this._ctxPanels.toArray()

    console.log(toArray)
    console.log('this._canvas.ctx', this._canvas.ctx)
    // this.draw()
    // toArray.forEach((ctxPanel) => ctxPanel.drawWithCtx(this._canvas.ctx))
    // toArray.forEach((ctxPanel) => ctxPanel)

  }

  getTransformedPointFromEvent(event: MouseEvent) {
    const point = eventToPointLocation(event)
    const originalPoint = new DOMPoint(point.x, point.y)
    return this._canvas.ctx.getTransform()
      .invertSelf()
      .transformPoint(originalPoint) as TransformedPoint
  }
}