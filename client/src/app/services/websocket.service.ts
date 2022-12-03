import { Injectable } from '@angular/core'
import { AnonymousSubject, Subject } from 'rxjs/internal/Subject'
import { map } from 'rxjs/operators'
import { Observable, Observer } from 'rxjs'
import { WebSocketSubject } from 'rxjs/webSocket'

const CHAT_URL = 'ws://localhost:3000/ws'

export interface Message {
  action: string
  username?: string
  message?: string
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  public messages: Subject<Message>
  private subject!: AnonymousSubject<MessageEvent>
  private socket$!: WebSocketSubject<any>
  // /*  // private messagesSubject$ = new Subject()
  /*    public messages$ = this.messagesSubject$.pipe(
        // switchAll(),
        catchError((e) => {
          throw e
        }),
      )*!/*/

  constructor() {
    this.messages = <Subject<Message>>this.connect(CHAT_URL).pipe(
      map((response: MessageEvent): Message => {
        console.log(response.data)
        let data = JSON.parse(response.data)
        return data
      }),
    )
  }

  /*  public connect2(): void {
      if (!this.socket$ || this.socket$.closed) {
        this.socket$ = this.getNewWebSocket()
        const messages = this.socket$.pipe(
          tap({
            error: (error) => console.log(error),
          }),
          catchError((_) => EMPTY),
        )
        this.messagesSubject$.next(messages)
      }
    }*/

  sendMessage(msg: any) {
    this.socket$.next(msg)
  }

  close() {
    this.socket$.complete()
  }

  public connect(url: string): AnonymousSubject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url)
      console.log('Successfully connected: ' + url)
    }

    return this.subject
  }

  /*  private getNewWebSocket() {
      // return webSocket(WS_ENDPOINT);
      return webSocket('ws://localhost:3000')
    }*/

  create(url: string): AnonymousSubject<MessageEvent> {
    let ws = new WebSocket(url)
    let observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs)
      ws.onerror = obs.error.bind(obs)
      ws.onclose = obs.complete.bind(obs)
      return ws.close.bind(ws)
    })
    let observer: Observer<MessageEvent> = {
      next: (data: Object) => {
        console.log('Message sent to websocket: ', data)
        if (ws.readyState === WebSocket.OPEN) {
          // ws.send(JSON.stringify(data))
          ws.send(JSON.stringify(data))
        }
      },
      error: (err) => console.log(err),
      complete: () => console.log(),
    }
    return new AnonymousSubject<MessageEvent>(observer, observable)
  }
}
