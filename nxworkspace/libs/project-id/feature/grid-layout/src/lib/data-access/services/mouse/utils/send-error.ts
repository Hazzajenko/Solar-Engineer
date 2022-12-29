import { MouseEventAction, sendMouseEvent } from "./mouse.event"

export function sendError(func: string, error: string) {
  const service = 'mouse'
  const event = sendMouseEvent(MouseEventAction.Error, { service, func, error })
  console.error(event)
  return event
}
