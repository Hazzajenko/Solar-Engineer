import { Component, OnInit } from '@angular/core'
import { AuthService } from './auth/auth.service'
import { WebsocketService } from './services/websocket.service'

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
  messages: string[] = []

  constructor(
    private auth: AuthService,
    public websocketService: WebsocketService,
  ) {}

  async signIn() {
    await this.auth.signIn({ email: 'test@email.com', password: 'password' })
    // .then((res) => console.log(res))
  }

  async ngOnInit(): Promise<void> {
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
    })
  }

  sendMsg(message: message) {
    this.websocketService.messages.next(message)
  }

  sendSocket() {
    this.sendMsg({
      action: 'broadcast',
      username: 'hazzajenko',
      message: 'hello',
    })
  }
}
