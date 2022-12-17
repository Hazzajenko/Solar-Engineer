import { TypeModel } from '../../../../../../../libs/shared/data-access/models/src/lib/type.model'

export interface CableModel {
  id: string
  project_id?: number
  join_id?: string
  in_join?: boolean
  model?: TypeModel
  // type?: TypeModel
  location: string
  // numberLocation?: number
  size?: number
  length?: number
  weight?: number
  created_at?: string
  color?: string
  version?: number
}
