import { inject, Injectable } from '@angular/core'
import { LinksFacade } from './links.facade'
import { LinksRepository } from './links.repository'

@Injectable({
  providedIn: 'root',
})
export class LinksStoreService {
  public select = inject(LinksFacade)
  public dispatch = inject(LinksRepository)
}
