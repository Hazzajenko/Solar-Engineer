import { EntityType } from '@design-app/shared'
import { Guid } from '@shared/utils'

export type TypeOfEntity = {
  id: Guid
  type: EntityType
}