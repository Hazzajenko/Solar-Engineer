import { StringColor } from './design-string.styles'
import { DesignEntityType } from '@design-app/shared'

export type DesignStringModel = {
  id: string
  name: string
  parallel: boolean
  color: StringColor
  type: DesignEntityType
}