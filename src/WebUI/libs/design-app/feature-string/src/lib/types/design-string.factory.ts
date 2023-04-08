import { DesignStringModel } from './design-string.model'
import { StringColor } from './design-string.styles'
import { DesignEntityType } from '@design-app/shared'
import { UndefinedString } from '@shared/data-access/models'
import { newGuid } from '@shared/utils'


export const DesignStringFactory = {
  create: (
    name: string = UndefinedString,
    color: StringColor = StringColor.Default,
    parallel: boolean = false,
  ): DesignStringModel => {
    return {
      id: newGuid(),
      name,
      color,
      parallel,
      type: DesignEntityType.String,
    }
  },
} as const