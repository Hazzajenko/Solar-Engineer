import { BlockType } from '@shared/data-access/models'

export interface LinksState {
  loaded: boolean
  error?: string | null
  typeToLink?: BlockType
  toLinkId?: string
}
