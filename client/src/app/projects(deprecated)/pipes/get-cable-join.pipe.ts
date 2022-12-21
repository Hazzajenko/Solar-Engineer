import { Pipe, PipeTransform } from '@angular/core'
import { CableModel } from '../models/deprecated-for-now/cable.model'
import { JoinModel } from '../models/deprecated-for-now/join.model'

@Pipe({
  name: 'getCableJoin',
  standalone: true,
})
export class GetCableJoin implements PipeTransform {
  constructor() {}

  transform(cable: CableModel, joins: JoinModel[]): JoinModel {
    return joins.find((join) => join.id === cable.join_id)!
  }
}
