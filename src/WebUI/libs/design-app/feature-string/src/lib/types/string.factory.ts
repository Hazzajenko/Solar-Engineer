import { StringModel } from './string.model'
import { StringColor } from './string.styles'
import { EntityType } from '@design-app/shared'
import { UndefinedString } from '@shared/data-access/models'
import { newGuid } from '@shared/utils'


export const StringFactory = {
  create: (
    name: string = UndefinedString,
    color: StringColor = StringColor.Default,
    parallel: boolean = false,
  ): StringModel => {
    return {
      id: newGuid(),
      name,
      color,
      parallel,
      type: EntityType.String,
    }
  },
} as const