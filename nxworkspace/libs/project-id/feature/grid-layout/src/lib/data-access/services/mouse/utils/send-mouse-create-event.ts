import { BlockType } from '@shared/data-access/models'

export interface EventSwitchOptions {
  type: BlockType
  location: string
}

export function sendMouseCreateEvent(options: EventSwitchOptions) {
  /*   switch (options.type) {
    case BlockType.PANEL: {
      return sendMouseEvent(MouseEventAction.CreateStartPanel, { location: options.location })
    }
    default:
      return sendMouseEvent(MouseEventAction.Error, {
        service: 'mouse.event',
        func: 'sendMouseCreateEvent',
        error: 'default',
      })
  } */
}
