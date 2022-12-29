export type ServiceType = 'mouse' | 'click' | 'drop'
export function sendError(service: ServiceType, func: string, error: string) {
  /* console.error()
  switch (service) {
    case 'click': {
      const res = sendClickEvent(ClickEventAction.Error, { service, func, error })
      console.error(res)
      return res
    }
    case 'mouse': {
      const res = sendMouseEvent(MouseEventAction.Error, { service, func, error })
      console.error(res)
      return res
    }
    case 'drop': {
      const res = sendDropEvent(DropEventAction.Error, { service, func, error })
      console.error(res)
      return res
    }
  } */
}
