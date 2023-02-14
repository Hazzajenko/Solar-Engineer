import { inject, Injectable } from '@angular/core'
import { MultiFacade } from './multi.facade'
import { MultiRepository } from './multi.repository'

@Injectable({
  providedIn: 'root',
})
export class MultiStoreService {
  public select = inject(MultiFacade)
  public dispatch = inject(MultiRepository)
}
