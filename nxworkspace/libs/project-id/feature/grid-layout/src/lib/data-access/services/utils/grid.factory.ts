import { ClickActionData } from '../../types/click/click.types'
import { DropActionData } from '../../types/drop/drop.types'
import { LinkActionData } from '../../types/links/links.types'
import { MouseActionData } from '../../types/mouse/mouse.types'
import { SharedActionData } from '../../types/shared.types'
import { ClickEventFactory } from '../click/click.factory'
import { DropEventFactory } from '../drop/drop.factory'
import { LinksEventFactory } from '../links/links.factory'
import { MouseEventFactory } from '../mouse/mouse.factory'

interface GridEventFactoryModel {
  mouseEvents(): MouseEventFactory
  dropEvents(): DropEventFactory
  clickEvents(): ClickEventFactory
  linksEvents(): LinksEventFactory
}

export class GridEventFactory implements GridEventFactoryModel {
  public mouseEvents() {
    return new MouseEventFactory()
  }

  public dropEvents() {
    return new DropEventFactory()
  }

  public clickEvents() {
    return new ClickEventFactory()
  }

  public linksEvents() {
    return new LinksEventFactory()
  }
}

type GridEventAction =
  | LinkActionData
  | ClickActionData
  | MouseActionData
  | DropActionData
  | SharedActionData

export type GridEventResult = {
  payload: GridEventAction
}

export interface BaseEventFactoryModelV2 {
  action(action: GridEventAction): GridEventResult
  error(error: string): GridEventResult
  fatal(fatal: string): GridEventResult
}
