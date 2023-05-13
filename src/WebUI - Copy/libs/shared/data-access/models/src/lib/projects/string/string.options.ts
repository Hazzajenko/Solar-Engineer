import { EntityOptions } from '@shared/data-access/models'

export interface StringOptions extends EntityOptions {
  name: string
  color: string
  parallel: boolean
  createdById: string
}
