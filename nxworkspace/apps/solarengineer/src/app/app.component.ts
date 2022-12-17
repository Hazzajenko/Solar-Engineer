import { AfterViewInit, Component, OnInit } from '@angular/core'
import { AuthService } from './auth/auth.service'
import { Message } from './services/websocket.service'
import { Store } from '@ngrx/store'
import { AppState } from './store/app.state'

interface message {
  action: string
  username?: string
  message?: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  /*  @ViewChild('canvas', { static: true })
    canvas!: ElementRef<HTMLCanvasElement>
    pathMapCoords$!: Observable<Map<string, { x: number; y: number }> | undefined>
    startX: number = 0
    startY: number = 0
    endX: number = 0
    endY: number = 0
    // canvasOffset = this.canvas.nativeElement.offsetTop
    offsetX: number = 0
    offsetY: number = 0
    scrollX: number = 0
    scrollY: number = 0*/
  title = 'solarengineer'
  content = ''
  received: Message[] = []
  sent: Message[] = []
  private ctx!: CanvasRenderingContext2D

  constructor(private auth: AuthService, private store: Store<AppState>) {
    /*    this.websocketService.messages.subscribe((msg) => {
          this.received.push(msg)
          console.log('Response from websocket: ' + msg)
        })*/
  }

  ngAfterViewInit(): void {
    /*    this.canvas.nativeElement.style.width = '100%'
        this.canvas.nativeElement.style.height = '100%'
        this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth
        this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight
        this.offsetX = this.canvas.nativeElement.offsetLeft
        this.offsetY = this.canvas.nativeElement.offsetTop
        this.scrollX = this.canvas.nativeElement.scrollLeft
        this.scrollY = this.canvas.nativeElement.scrollTop

        this.ctx = this.canvas.nativeElement.getContext('2d')!*/
    /*
        firstValueFrom(this.store.select(selectBlocksByProjectIdRouteParams).pipe(
          map(blocks => blocks.find(b => b.id === '1f1cdc069343b93b5ec0db0ef44d'))
        )).then(res => {
          this.ctx.beginPath()
          this.ctx.moveTo(this.startX, this.startY)
          this.ctx.lineTo(res!.x!, res!.y!)
          this.ctx.stroke()
        })*/
  }

  async signIn() {
    await this.auth.signIn({ username: 'string', password: 'Password1' })
    // .then((res) => console.log(res))
  }

  /*  drawPaths(pathMapCoords: Map<string, { x: number; y: number }>) {
      pathMapCoords.forEach((cord) => {
        this.ctx.strokeStyle = '#e1180c'
        this.ctx.lineWidth = 5
        this.ctx.beginPath()
        this.ctx.moveTo(this.startX, this.startY)
        // const mouseX = event.clientX - this.offsetX
        // const mouseY = event.clientY - this.offsetY
        // this.startX = event.clientX - rect.left
        // this.startY = event.clientY - rect.top
        this.ctx.lineTo(cord.x - 350, cord.y + 50)
        this.ctx.stroke()
      })
    }*/

  async ngOnInit(): Promise<void> {
    // this.pathMapCoords$ = this.store.select(selectSelectedStringPathMapCoords)
    // console.log('GUID NGRXDATA', getGuid().toString())
    // console.log('GUID NGRXDATA', Guid.create().toString())
    await this.signIn()
    /*    let socket = new WebSocket('ws://localhost:3000/socket')
        socket.onmessage = (event) => {
          console.log('received from server', event.data)
        }
        socket.send('hello from client')
        this.websocketService.messages.subscribe((messages) => {
          console.log(messages)
        })
        await this.auth.signIn({ email: 'test@email.com', password: 'password' })
        this.sendMsg({
          action: 'username',
          username: 'hazzajenko',
        })
        this.sendMsg({
          action: 'broadcast',
          username: 'hello',
        })*/
  }

  /*  sendMsg(message: message) {
      /!*    let message = {
            source: '',
            content: ''
          };
          message.source = 'localhost';
          message.content = this.content;*!/

      this.sent.push(message)
      // this.websocketService.sendMessage(message)
      // this.websocketService.messages.next(message)

      // .next(message)
      /!*    const socket$ = this.websocketService.create('ws://localhost:3000/socket')
          /!*    let socket = new WebSocket('ws://localhost:3000/socket')
              socket.onmessage = (event) => {
                console.log('received from server', event.data)
              }*!/

          this.websocketService.messages.next(message)*!/
    }*/

  /*  sendSocket() {
      this.sendMsg({
        action: 'broadcast',
        username: 'hazzajenko',
        message: 'hello',
      })
    }*/
}

/*
if (typeof Worker !== 'undefined') {
  // Create a new
  const worker = new Worker(new URL('./app.worker', import.meta.url));
  worker.onmessage = ({ data }) => {
    console.log(`page got message: ${data}`);
  };
  worker.postMessage('hello');
} else {
  // Web Workers are not supported in this environment.
  // You should add a fallback so that your program still executes correctly.
}*/
