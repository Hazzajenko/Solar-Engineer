import { getGuid } from '@shared/utils'
import { EntityModel, EntityOptions, EntityType } from './entity.model'

export interface LinkOptions extends EntityOptions {
  stringId: string
  positiveToId: string
  negativeToId: string
}

export class PanelLinkModel extends EntityModel {
  stringId: string
  positiveToId: string
  negativeToId: string

  constructor(options: LinkOptions) {
    super(options)
    this.id = getGuid().toString()
    this.projectId = options.projectId
    this.type = EntityType.LINK
    this.stringId = options.stringId
    this.positiveToId = options.positiveToId
    this.negativeToId = options.negativeToId
  }
}
