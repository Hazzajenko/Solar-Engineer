import { IProject } from './iproject.interface'
import { ProjectUserModel } from './project-user.model'
import { ProjectOptions } from './project.options'
import { newGuid } from '@shared/utils'

export class ProjectModel implements IProject {
  id!: string
  name: string
  createdById: string
  createdTime: string
  lastModifiedTime: string
  memberIds: string[]
  members: ProjectUserModel[]

  constructor(options: ProjectOptions) {
    this.id = newGuid()
    this.name = options.name
    this.createdById = options.createdById
    this.createdTime = new Date().toISOString()
    this.lastModifiedTime = new Date().toISOString()
    this.memberIds = []
    this.members = []
  }
}