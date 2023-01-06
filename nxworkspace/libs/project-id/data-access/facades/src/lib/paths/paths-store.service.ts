import { inject, Injectable } from '@angular/core'

import { PathsFacade } from './paths.facade'
import { PathsRepository } from './paths.repository'


@Injectable({
  providedIn: 'root',
})
export class PathsStoreService {
  public select = inject(PathsFacade)
  public dispatch = inject(PathsRepository)
}
