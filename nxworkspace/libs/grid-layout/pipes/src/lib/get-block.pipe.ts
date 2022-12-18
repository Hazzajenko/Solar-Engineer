import { Pipe, PipeTransform } from '@angular/core'
import { BlockModel } from '@shared/data-access/models'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Pipe({
  name: 'getBlock',
  standalone: true,
})
export class GetBlockPipe implements PipeTransform {

  transform(blocks$: Observable<BlockModel[]>, location: string) {
    return blocks$.pipe(
      map(blocks => blocks.find(block => block.location === location))
    )
  }
}
