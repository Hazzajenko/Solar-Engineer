import { Injectable } from '@angular/core'
import { interpret } from 'xstate'
import { canvasAppMachine } from './client.machine'

@Injectable({
  providedIn: 'root',
})
export class ClientMachineService {

  service = interpret(canvasAppMachine)
    .onTransition((state) => {
      console.log(state.value)
    })

  constructor() {
    this.service.start()
  }

  /*  export const DragBoxMachineService = interpret(DragBoxMachine).onTransition((state) => {
   console.log(state.value)
   dragBoxMachineState.next(state)
   })*/

  // DragBoxMachineService.start()

}