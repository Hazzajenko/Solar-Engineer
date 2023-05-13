import { UpdateStr } from '@ngrx/entity/src/models'

export interface ProjectItemUpdate<TProjectItem> extends UpdateStr<TProjectItem> {
  id: string
  projectId: string
  changes: Partial<TProjectItem>
}
