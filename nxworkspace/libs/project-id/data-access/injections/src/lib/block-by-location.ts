import { InjectionToken, inject } from '@angular/core'
import { BlocksFacade } from '@project-id/data-access/facades'

export const BLOCKS_FACADE = new InjectionToken('Blocks Facade', {
  providedIn: 'root',
  factory: () => {
    return {
      service: inject(BlocksFacade).allBlocks$,
    }
  },
})

export const GET_BLOCK = new InjectionToken<BlocksFacade>('GET_BLOCK', {
  providedIn: 'root',
  factory: () => {
    return inject(BlocksFacade)
  },
})
export const COURSES_SERVICE_TOKEN = new InjectionToken<BlocksFacade>('COURSES_SERVICE_TOKEN')
