import { map } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import { Pipe, PipeTransform } from '@angular/core'
import { BlockModel } from '@shared/data-access/models'

@Pipe({
  name: 'getBlockAsync',
  standalone: true,
})
export class GetBlockAsyncPipe implements PipeTransform {
  transform(
    blocks$: Observable<BlockModel[]>,
    location: string,
  ): Observable<BlockModel | undefined> {
    if (!blocks$) {
      console.log('noblocks')
      return of(undefined)
    }
    return blocks$.pipe(map((blocks) => blocks.find((block) => block.location === location)))
  }
}
