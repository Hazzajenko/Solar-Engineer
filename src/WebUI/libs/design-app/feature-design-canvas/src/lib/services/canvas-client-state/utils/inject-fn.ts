import { inject } from '@angular/core'
import { CanvasClientStateService } from '@design-app/feature-design-canvas'

export const InjectClientState = () => {
  return inject(CanvasClientStateService)
}