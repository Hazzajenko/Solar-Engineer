import { firstValueFrom, Observable } from 'rxjs';
import { BlockModel } from '@shared/data-access/models'


export type MouseEventRequest = {
  event: MouseEvent
  location: string
}

export class GridClick {
  event: MouseEvent
  location: string
  existingBlock: BlockModel | undefined
  shiftKey: boolean
  // private blocksFacade: BlocksFacade
  constructor(block: BlockModel | undefined, event: MouseEvent, location: string) {
    // this.blocksFacade = bF
    this.event = event
    this.location = location
    this.existingBlock = block/*  bF.blockByLocation(location) */
    this.shiftKey = event.shiftKey
  }
/*
  async isBlockExisting() {
    return this.blocksFacade.blockByLocation(this.location)
  } */
}
