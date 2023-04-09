import { StringColor } from './string.styles'
import { EntityType } from '@design-app/shared'

export type StringModel = {
  id: string
  name: string
  parallel: boolean
  color: StringColor
  type: EntityType
}