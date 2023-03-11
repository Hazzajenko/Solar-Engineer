import { BlockType } from '../block'

export interface IBlock {
  id: string
  projectId: string
  location: string
  type: BlockType
}
