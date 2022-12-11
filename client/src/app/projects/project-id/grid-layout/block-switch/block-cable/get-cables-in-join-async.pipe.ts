import { Pipe, PipeTransform } from '@angular/core'
import { CableModel } from 'src/app/projects/models/deprecated-for-now/cable.model'
import { CablesEntityService } from '../../../services/ngrx-data/cables-entity/cables-entity.service'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'

@Pipe({
  name: 'getCablesInJoinLengthAsync',
  standalone: true,
})
export class GetCablesInJoinLengthPipe implements PipeTransform {
  constructor(private cablesEntity: CablesEntityService) {}

  transform(cable: CableModel): Observable<number> {
    if (!cable) {
      return of(0)
    }
    return this.cablesEntity.entities$.pipe(
      map((cables) => cables.filter((c) => cable.join_id === c.join_id)),
      map((cables) => cables.length),
    )
  }
}
