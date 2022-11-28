import { DisconnectionPointModel } from './../../../../models/disconnection-point.model'
import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'getDisconnectionPoint',
  standalone: true,
})
export class GetDisconnectionPointPipe implements PipeTransform {
  transform(
    disconnectionPoints?: DisconnectionPointModel[],
    blockId?: string,
  ): DisconnectionPointModel | undefined {
    if (!disconnectionPoints || !blockId) {
      return undefined
    }

    return disconnectionPoints.find((dp) => dp.location === blockId)
  }
}
