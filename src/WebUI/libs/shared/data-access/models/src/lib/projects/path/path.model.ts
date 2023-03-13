import { getGuid } from '@shared/utils'
import { PathOptions } from '@shared/data-access/models'

export class PathModel {
  id: string
  projectId: string
  stringId: string
  panelId: string
  link: number
  count: number
  color: string

  constructor(options: PathOptions) {
    this.id = options.id ? options.id : getGuid().toString()
    this.projectId = options.projectId
    this.stringId = options.stringId
    this.panelId = options.panelId
    this.link = options.link
    this.count = options.count
    this.color = options.color
  }
}
