import { inject, Injectable } from '@angular/core'
import { BlocksFacade } from './blocks.facade'
import { BlocksRepository } from './blocks.repository'


@Injectable({
  providedIn: 'root',
})
export class BlocksStoreService {
  public select = inject(BlocksFacade)
  public dispatch = inject(BlocksRepository)
}

