import { Component, OnInit } from '@angular/core'
import { AuthService } from './auth/auth.service'
import { Message } from './services/websocket.service'

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
export class AppComponent implements OnInit {
  title = 'solarengineer'
  content = ''
  received: Message[] = []
  sent: Message[] = []

  constructor(private auth: AuthService) {
    /*    this.websocketService.messages.subscribe((msg) => {
          this.received.push(msg)
          console.log('Response from websocket: ' + msg)
        })*/
  }

  async signIn() {
    await this.auth.signIn({ username: 'string', password: 'Password1' })
    // .then((res) => console.log(res))
  }

  async ngOnInit(): Promise<void> {
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
