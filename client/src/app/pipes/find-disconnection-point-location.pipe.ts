import { Pipe, PipeTransform } from '@angular/core'
import { DisconnectionPointModel } from '../projects/models/disconnection-point.model'

@Pipe({
  name: 'findDisconnectionPointLocation',
  standalone: true,
})
export class FindDisconnectionPointLocationPipe implements PipeTransform {
  transform(
    disconnectionPoints: DisconnectionPointModel[],
    blockId: string,
  ): DisconnectionPointModel | undefined {
    if (!disconnectionPoints || !blockId) {
      return undefined
      // return panels
    }

    return disconnectionPoints.find(
      (disconnectionPoint) => disconnectionPoint.location === blockId,
    )
  }
}
