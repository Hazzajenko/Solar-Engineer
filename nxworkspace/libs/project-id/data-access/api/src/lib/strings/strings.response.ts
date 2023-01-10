import { StringModel } from '@shared/data-access/models'


export interface StringResponse {
  string: StringModel
}

export interface ManyStringsResponse {
  strings: StringModel[]
}


export interface UpdateManyStringsResponse {
  successfulUpdates: number
  errors: number
}

export interface DeleteStringResponse {
  stringId: string
}

export interface DeleteManyStringsResponse {
  // stringIds: string[]
  successfulDeletes: number
  errors: number
}