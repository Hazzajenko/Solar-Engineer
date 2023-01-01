
import { BlockModel, BlockType } from '@shared/data-access/models'

export type SelectStart = {
  action: 'SELECT_START'
  data: {
    location: string
  }
}

export type SelectFinish = {
  action: 'SELECT_FINISH'
  data: {
    location: string
    ids: string[]
  }
}

export type CreateStart = {
  action: 'CREATE_START'
  data: {
    location: string
    type: BlockType
  }
}

export type CreateFinish = {
  action: 'CREATE_FINISH'
  data: {
    location: string
    type: BlockType
    blocks: BlockModel[]
  }
}


export type DeleteStart = {
  action: 'DELETE_START'
  data: {
    location: string
  }
}

export type DeleteFinish = {
  action: 'DELETE_FINISH'
  data: {
    location: string
    ids: string[]
  }
}

export type MultiActionData =
  | SelectStart
  | SelectFinish
  | CreateStart
  | CreateFinish
  | DeleteStart
  | DeleteFinish
