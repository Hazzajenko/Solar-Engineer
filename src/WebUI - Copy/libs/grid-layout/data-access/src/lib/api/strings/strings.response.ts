import { GridStringModel } from '@shared/data-access/models'

export interface StringResponse {
  string: GridStringModel
}

export interface ManyStringsResponse {
  strings: GridStringModel[]
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