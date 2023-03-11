import { getGuid } from '@shared/utils'
import { EntityModel, EntityOptions } from './entity.model'
import { ProjectModelType } from './model'

export interface LinkOptions extends EntityOptions {
  stringId: string
  positiveToId: string
  negativeToId: string
}

export class PanelLinkModel extends EntityModel {
  override type = ProjectModelType.PanelLink
  stringId: string
  panelPositiveToId: string
  panelNegativeToId: string

  constructor(options: LinkOptions) {
    super(options)
    this.id = getGuid().toString()
    this.projectId = options.projectId
    this.type = ProjectModelType.PanelLink
    // this.type = ENTITY_TYPE.PANEL_LINK
    this.stringId = options.stringId
    this.panelPositiveToId = options.positiveToId
    this.panelNegativeToId = options.negativeToId
  }
}
