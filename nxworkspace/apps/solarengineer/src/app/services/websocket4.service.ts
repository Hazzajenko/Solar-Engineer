import { Injectable } from '@angular/core'
import { Subject } from 'rxjs/internal/Subject'
import { catchError, tap } from 'rxjs/operators'
import { EMPTY } from 'rxjs'
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'

const CHAT_URL = 'ws://localhost:3000/ws'

export interface Message {
  source: string
  content: string
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService4 {
  private socket$?: WebSocketSubject<any>
  private messagesSubject$ = new Subject()

  /*    public messages$ = this.messagesSubject$.pipe(
        // switchAll(),
        catchError((e) => {
          throw e
        }),
      )*!/*/

  constructor() {}

  public connect2(): void {
    // if (!this.socket$ || this.socket$.closed) {
    this.socket$ = this.getNewWebSocket()
    console.log('Successfully connected')
    const messages = this.socket$.pipe(
      tap({
        error: (error) => console.log(error),
      }),
      catchError((_) => EMPTY),
    )
    this.messagesSubject$.next(messages)
    // }
  }

  sendMessage(msg: any) {
    this.socket$!.next(msg)
  }

  close() {
    this.socket$!.complete()
  }

  private getNewWebSocket() {
    // return webSocket(WS_ENDPOINT);
    return webSocket('ws://localhost:3000/ws')
  }
}
