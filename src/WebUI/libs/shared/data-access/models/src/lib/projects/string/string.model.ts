import { getGuid } from '@shared/utils'
import { EntityModel } from '../entity.model'
import { ProjectModelType } from '../model'
import { IEntity } from '../interfaces'
import { IUserObject } from '../interfaces/i-user-object.interface'
import { IString } from './i-string.interface'
import { StringOptions } from './string.options'

/*
export interface StringOptions extends EntityOptions {
  name: string
  color: string
  parallel: boolean
}
*/

export class StringModel extends EntityModel implements IEntity, IUserObject, IString {
  override id: string
  name: string
  parallel: boolean
  color: string
  createdById: string
  createdTime: string
  lastModifiedTime: string

  constructor(options: StringOptions) {
    super(options)
    this.id = getGuid()
    this.projectId = options.projectId
    this.name = options.name
    this.color = options.color
    this.parallel = options.parallel
    this.createdById = options.createdById
    this.createdTime = new Date().toISOString()
    this.lastModifiedTime = new Date().toISOString()
  }

  override type: ProjectModelType = ProjectModelType.String
}