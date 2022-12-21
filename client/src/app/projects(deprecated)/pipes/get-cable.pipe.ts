import { Pipe, PipeTransform } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { CableModel } from '../models/deprecated-for-now/cable.model'

@Pipe({
  name: 'getCable',
  standalone: true,
})
export class GetCablePipe implements PipeTransform {
  constructor() {}

  transform(cables: Observable<CableModel[]>, location: string) {
    return cables.pipe(
      map((cables) => {
        return cables.find((c) => c.location === location)
      }),
    )
  }
}
