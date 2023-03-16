import { ProjectOptions } from './project.options'
import { getGuid } from '@shared/utils'
import { IProject } from './iproject.interface'

export class ProjectModel implements IProject {
  id!: string
  name: string
  createdById: string
  createdTime: string
  lastModifiedTime: string
  memberIds: string[]

  constructor(options: ProjectOptions) {
    this.id = getGuid()
    this.name = options.name
    this.createdById = options.createdById
    this.createdTime = new Date().toISOString()
    this.lastModifiedTime = new Date().toISOString()
    this.memberIds = []
  }
}