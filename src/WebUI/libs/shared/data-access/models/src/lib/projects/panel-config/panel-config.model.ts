import { ENTITY_TYPE, EntityModel, EntityType } from '../entity.model'
import { IEntity } from '../interfaces'
import { IUserObject } from '../interfaces/i-user-object.interface'
import { getGuid } from '@shared/utils'
import { IPanelConfig } from './i-panel-config.interface'
import { PanelConfigOptions } from './panel-config.options'

export class PanelConfigModel extends EntityModel implements IEntity, IUserObject, IPanelConfig {
  override type: EntityType = ENTITY_TYPE.PANEL_CONFIG
  brand?: string
  name: string
  fullName: string
  currentAtMaximumPower: number
  shortCircuitCurrent: number
  shortCircuitCurrentTemp: number
  maximumPower: number
  maximumPowerTemp: number
  voltageAtMaximumPower: number
  openCircuitVoltage: number
  openCircuitVoltageTemp: number
  length: number
  weight: number
  width: number
  createdById: string
  createdTime: string
  lastModifiedTime: string
  default: boolean

  constructor(options: PanelConfigOptions) {
    super(options)
    this.id = getGuid()
    this.createdById = options.createdById
    this.brand = options.brand
    this.name = 'Longi Himo555m'
    // this.fullName = `${this.brand} ${this.name}`
    this.fullName = this.brand ? `${this.brand} ${this.name}` : this.name
    this.projectId = options.projectId
    this.currentAtMaximumPower = 13.19
    this.shortCircuitCurrent = 14.01
    this.shortCircuitCurrentTemp = 0.05
    this.maximumPower = 555
    this.maximumPowerTemp = -0.34
    this.voltageAtMaximumPower = 42.1
    this.openCircuitVoltage = 49.95
    this.openCircuitVoltageTemp = -0.265
    this.length = 2256
    this.weight = 1133
    this.width = 27.2
    this.default = false
    this.createdTime = new Date().toISOString()
    this.lastModifiedTime = new Date().toISOString()
  }
}
