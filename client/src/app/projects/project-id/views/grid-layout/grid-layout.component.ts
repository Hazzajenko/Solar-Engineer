import {
  Component,
  Directive,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core'
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnd,
  moveItemInArray,
} from '@angular/cdk/drag-drop'
import { InverterModel } from '../../../models/inverter.model'
import { TrackerModel } from '../../../models/tracker.model'
import { StringModel } from '../../../models/string.model'
import { PanelModel } from '../../../models/panel.model'
import { PanelsService } from '../../../services/panels.service'
import { select, Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import { selectStringById } from '../../../store/strings/strings.selectors'
import { take } from 'rxjs/operators'
import { GridService } from '../../../services/grid.service'
import { selectPanelsByProjectId } from '../../../store/panels/panels.selectors'

interface GridPanel {
  location: string
}

@Directive({ selector: 'pane' })
export class Pane {
  @Input() id!: string
}

@Component({
  selector: 'app-grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.scss'],
})
export class GridLayoutComponent implements OnInit {
  @Input() inverters?: InverterModel[]
  @Input() trackers?: TrackerModel[]
  @Input() strings?: StringModel[]
  @Input() panels?: PanelModel[]
  @Input() selectedStringId?: number
  public context!: CanvasRenderingContext2D
  occupiedSpots: string[] = []
  @ViewChild('canvas', { static: true }) myCanvas!: ElementRef
  @ViewChildren(Pane) panes!: QueryList<Pane>
  serializedPanes: string = ''
  p!: DOMRect
  @ViewChildren('slides') private slides!: QueryList<ElementRef>

  /*  panels: GridPanel[] = [
      { location: '14' },
      { location: '35' },
      { location: '74' },
      { location: '32' },
      { location: '96' },
    ];*/

  constructor(
    private panelsService: PanelsService,
    private store: Store<AppState>,
    public grid: GridService,
  ) {
    this.panels?.forEach((panel) => {
      console.log(panel?.location)
    })
  }

  ngAfterViewInit() {
    // viewChildren is set
    this.slides.changes.subscribe(() => console.log(this.slides))
    this.calculateSerializedPanes()
    this.panes.changes.subscribe((r) => {
      this.calculateSerializedPanes()
      console.log('PANES', this.panes)
      console.log('PANES', this.serializedPanes)
    })
    console.log('PANES', this.panes)
  }

  onDragEnded(event: CdkDragEnd) {
    this.p = event.source.getRootElement().getBoundingClientRect()
    console.log('p', this.p)
    // this.p
  }

  calculateSerializedPanes() {
    setTimeout(() => {
      this.serializedPanes = this.panes.map((p) => p.id).join(', ')
    }, 0)
  }

  ngOnInit(): void {
    /*    ctx?.beginPath() // Start a new path
        ctx?.moveTo(30, 50) // Move the pen to (30, 50)
        ctx?.lineTo(150, 100) // Draw a line to (150, 100)
        ctx?.stroke() // Render the path*/
    this.panels?.forEach((panel) => {
      console.log(panel?.location)
    })
    beep()
    this.store
      .select(
        selectPanelsByProjectId({
          projectId: 3,
        }),
      )
      .subscribe((panels) => {
        console.log(panels)
        panels.forEach((panel) => {
          console.log(panel?.location)
          this.occupiedSpots.push(panel?.location)
        })
        console.log(this.occupiedSpots)
        this.test()
      })
    console.log('DONE', this.occupiedSpots)
    console.log('this.panels!', this.strings!)
    const canvas: HTMLCanvasElement = this.myCanvas.nativeElement
    const ctx = canvas.getContext('2d')
    const canvasposition = canvas.getBoundingClientRect()
    console.log('canvasposition', canvasposition)

    canvas.addEventListener(
      'mousemove',
      function (e) {
        var pos = getMousePos(canvas, e), /// provide this canvas and event
          x = pos.x,
          y = pos.y

        /// check x and y against the grid
      },
      false,
    )

    function getMousePos(canvas: HTMLCanvasElement, e: MouseEvent) {
      var rect = canvas.getBoundingClientRect()
      console.log({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    function beep() {
      const element = document.getElementById('hello')
      const position = element?.getBoundingClientRect()
      const x = position?.left
      const y = position?.top
      console.log('CORDS', x, y)
    }

    if (ctx) {
      ctx.strokeStyle = 'red'
      ctx.fillStyle = 'rgba(17, 0, 255, 0.5)'
      this.#drawRectangle(ctx)
      this.#useGradients(ctx)
      this.#drawString(ctx, 200, 200, 400, 400)
      this.#drawArc(ctx)
      this.#drawCurve(ctx)
      /*      this.#drawRectangle(ctx)
          this.#drawTriangle(ctx)
          this.#drawArc(ctx)
          this.#drawCurve(ctx)
          this.#drawUsingPath(ctx)
          this.#drawLine(ctx)
          this.#drawText(ctx)*/
    }
    const element = document.getElementById('hello')
    const position = element?.getBoundingClientRect()
    const x = position?.left
    const y = position?.top
    console.log('CORDS', x, y)
  }

  /*  getMousePos(canvas, e) {
      const rect = canvas.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }*/

  test() {
    console.log(this.occupiedSpots)
  }

  numSequence(n: number): Array<number> {
    return Array(n)
  }

  taskDrop(event: CdkDragDrop<PanelModel, any>) {
    console.log(event.dropPoint.x, event.dropPoint.y)
    console.log(event)
    moveItemInArray(this.panels!, event.previousIndex, event.currentIndex)
    console.log('previousIndex', event.previousIndex)
    console.log('currentIndex', event.currentIndex)
    console.log(event)
    console.log(event.item.data)
    console.log(event.item.data.stringId)

    const panel = event.item.data
    const update: PanelModel = {
      id: panel.id,
      inverterId: panel.inverterId,
      trackerId: panel.trackerId,
      stringId: panel.stringId,
      location: event.container.id,
      version: panel.version,
    }
    console.log('panels', this.panels)
    const doesExist = this.panels?.find(
      (panel) => panel.location === event.container.id,
    )
    if (doesExist) {
      console.log('location taken')
      return
    }
    this.panelsService.updatePanel(3, update).then((res) => console.log(res))
  }

  isSpotFreePredicate(item: CdkDrag<PanelModel>) {
    console.log(this.occupiedSpots)
    return true
    // return !this.occupiedSpots.includes(item.dropContainer.id)
  }

  divClick(location: string, event: MouseEvent, thing: HTMLDivElement) {
    const area = thing.getBoundingClientRect()
    const canvas: HTMLCanvasElement = this.myCanvas.nativeElement
    const ctx = canvas.getContext('2d')
    ctx!.strokeStyle = 'red'
    ctx!.fillStyle = 'rgba(17, 0, 255, 0.5)'
    this.#drawString(ctx!, area.x - 50, area.y - 50, area.x + 200, area.y + 200)
    console.log(thing.getBoundingClientRect())
    console.log('click')
    console.log('updatedPane', this.panes)
    console.log(event.x, event.y, event.clientX, event.clientY)
    const pane = this.panes.find((pane) => pane.id === location)
    console.log('updatedPane', pane)
    // this.panes.
    // const position = element?.getBoundingClientRect()
    // const x = position?.left
    // const y = position?.top
    // console.log('CORDS', x, y)

    if (!this.selectedStringId) console.log('select string')

    if (this.selectedStringId) {
      console.log('panels', this.panels)
      const doesExist = this.panels?.find(
        (panel) => panel.location === location,
      )
      if (doesExist) {
        console.log('location taken')
        return
      }
      const selectedString = this.store.pipe(
        select(selectStringById({ id: this.selectedStringId })),
      )
      if (!selectedString) {
        console.log('select string')
        return
      }
      selectedString.pipe(take(1))
      this.store
        .select(selectStringById({ id: this.selectedStringId }))
        .subscribe((string) => {
          if (string) {
            this.panelsService
              .createPanelFromGrid(
                3,
                string.inverterId,
                string.trackerId,
                string,
                location,
              )
              .then((res) => console.log(res))
          }
        })
    }
  }

  #drawString(
    ctx: CanvasRenderingContext2D,
    n1: number,
    n2: number,
    n3: number,
    n4: number,
  ) {
    ctx.beginPath()
    /*    ctx.moveTo(n1 - 600, n2 - 700)
        ctx.lineTo(n3, n4)*/
    console.log(n1)
    console.log(n2)
    const up1 = n1 - 641 + 266.75 + 100
    const up2 = n2 - 280
    const up3 = n3 - 641 + 266.75 + 100
    const up4 = n4 - 280
    console.log(up1)
    console.log(up2)
    ctx.moveTo(100, 80)
    ctx.lineTo(100, 20)
    ctx.moveTo(up1, up2)
    ctx.lineTo(up3, up4)
    ctx.stroke()
    // ctx.fill()
  }

  #drawRectangle(ctx: CanvasRenderingContext2D) {
    ctx.fillRect(20, 20, 100, 100)
    ctx.clearRect(40, 40, 30, 30)
    ctx.strokeRect(50, 50, 10, 10)
  }

  #drawTriangle(context: CanvasRenderingContext2D) {
    context.beginPath()
    context.moveTo(150, 70)
    context.lineTo(200, 20)
    context.lineTo(200, 120)
    context.fill()
    // context.closePath();
    // context.stroke();
  }

  #drawArc(context: CanvasRenderingContext2D) {
    context.beginPath()
    context.arc(300, 100, 80, (Math.PI / 180) * 0, (Math.PI / 180) * 360)
    context.stroke()
    // context.fill();
  }

  #drawCurve(context: CanvasRenderingContext2D) {
    context.beginPath()
    context.moveTo(500, 200)
    context.quadraticCurveTo(550, 0, 600, 200)
    context.stroke()
    context.beginPath()
    context.moveTo(700, 200)
    context.bezierCurveTo(750, 0, 750, 100, 800, 200)
    context.stroke()
  }

  #drawUsingPath(context: CanvasRenderingContext2D) {
    context.lineWidth = 20
    context.lineJoin = 'bevel'
    const rectangle = new Path2D()
    rectangle.rect(20, 150, 100, 100)
    context.stroke(rectangle)
    const circle = new Path2D()
    circle.arc(300, 300, 80, (Math.PI / 180) * 0, (Math.PI / 180) * 360)
    context.fill(circle)
  }

  #drawLine(context: CanvasRenderingContext2D) {
    context.lineWidth = 10
    context.lineCap = 'round'
    context.setLineDash([4, 4])
    context.lineDashOffset = 0
    context.beginPath()
    context.moveTo(100, 600)
    context.lineTo(200, 600)
    context.stroke()
  }

  #drawText(context: CanvasRenderingContext2D) {
    context.shadowOffsetX = 4
    context.shadowOffsetY = 4
    context.shadowBlur = 3
    context.shadowColor = 'rgba(0, 0, 0, 0.5)'
    context.fillStyle = 'black'
    context.font = '48px Arial'
    context.fillText('Hello', 100, 500)
  }

  #useGradients(context: CanvasRenderingContext2D) {
    const lineargradient = context.createLinearGradient(20, 20, 120, 120)
    lineargradient.addColorStop(0, 'white')
    lineargradient.addColorStop(1, 'black')
    context.fillStyle = lineargradient
    const radgrad = context.createRadialGradient(300, 300, 40, 300, 300, 80)
    radgrad.addColorStop(0, '#A7D30C')
    radgrad.addColorStop(0.9, '#019F62')
    radgrad.addColorStop(1, 'rgba(1, 159, 98, 0.5)')
    context.fillStyle = radgrad
    const conicGrad = context.createConicGradient((Math.PI / 180) * 0, 150, 70)
    conicGrad.addColorStop(0, '#A7D30C')
    conicGrad.addColorStop(1, '#fff')
    context.fillStyle = conicGrad
  }
}
