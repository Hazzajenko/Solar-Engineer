import { ProjectModelType } from '../model'
import { newGuid } from '@shared/utils'

export interface BlockOptions {
  projectId: string
  location: string
  // type: BlockType
}

export const BLOCK_TYPE = {
  UNDEFINED: 'Undefined',
  INVERTER: 'Inverter',
  PANEL: 'Panel',
  CABLE: 'Cable',
  DISCONNECTIONPOINT: 'DisconnectionPoint',
  TRAY: 'Tray',
  RAIL: 'Rail',
} as const

export type BlockType = (typeof BLOCK_TYPE)[keyof typeof BLOCK_TYPE]

/*export enum BlockType {
 UNDEFINED,
 INVERTER,
 PANEL,
 CABLE,
 DISCONNECTIONPOINT,
 TRAY,
 RAIL,
 }*/

export class BlockModel {
  id: string
  projectId: string
  location: string
  type: ProjectModelType = ProjectModelType.Undefined

  // type: BlockType = BLOCK_TYPE.UNDEFINED

  constructor(options: BlockOptions, id?: string) {
    this.id = id ? id : newGuid()
    this.projectId = options.projectId
    this.location = options.location
    // this.type = options.type
  }

  /*  static fromSerialized(serialized: string) {
   const user: ReturnType<User["toObject"]> = JSON.parse(serialized);

   return new User(
   user.id,
   new Email(user.email)
   );
   }*/
}