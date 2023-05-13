import { BlockType } from '@shared/data-access/models'

export interface LinksStateModel {
  loaded: boolean
  error?: string | null
  typeToLink?: BlockType
  toLinkId?: string
}
