import { getGuid } from '@shared/utils'
import { PanelIdPath } from 'libs/shared/data-access/models/src/lib/projects/path.model'
import { ENTITY_TYPE, EntityModel, EntityOptions, EntityType } from './entity.model'

export interface StringOptions extends EntityOptions {
  name: string
  color: string
  parallel: boolean
}

export class StringModel extends EntityModel {
  override type: EntityType = ENTITY_TYPE.STRING
  name: string
  parallel: boolean
  color: string
  panelPaths: PanelIdPath[] = []
  // panelPathRecord: PanelPathRecord = {}
  // linkPathMap?: { [panelId: string]: StringPanelLinkPath }
  // linkPathMap?: Map<PanelId, PanelLinkPath>
  inverterId?: string
  trackerId?: string
  // type?: TypeModel
  panelAmount?: number
  createdAt?: string
  version?: number
  totalVoc?: number
  totalVmp?: number
  totalPmax?: number
  totalIsc?: number
  totalImp?: number

  constructor(options: StringOptions) {
    super(options)
    this.id = getGuid().toString()
    this.projectId = options.projectId
    this.name = options.name
    this.color = options.color
    this.parallel = options.parallel
    // this.type = EntityType.STRING
  }

  makeParallel?() {
    this.parallel = true
    return this
  }
}
