import { Injectable } from '@angular/core'
import { Observable, Observer } from 'rxjs'
import { Subject } from 'rxjs/internal/Subject'

@Injectable({
  providedIn: 'root',
})
export class WebsocketService2 {
  private ws!: WebSocket
  private subject!: Subject<any>

  constructor() {}

  public connect(): Observable<any> {
    if (!this.subject) {
      this.subject = this.create()
    }
    return this.subject.asObservable()
  }

  create() {
    this.ws = new WebSocket('ws://localhost:3000/echo')

    const observable = Observable.create((obs: Observer<MessageEvent>) => {
      this.ws.onmessage = obs.next.bind(obs)
      this.ws.onerror = obs.error.bind(obs)
      this.ws.onclose = obs.complete.bind(obs)

      return this.ws.close.bind(this.ws)
    })

    const observer = {
      next: (data: Object) => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(data))
        }
      },
    }

    return Subject.create(observer, observable)
  }

  sendMessage(message: string) {
    console.log(message)
    this.ws.send(message)
  }
}
