import { BackgroundColor } from '../colors'
import { PanelColorState, PanelRotationConfig } from './free-panel.config'
import { XyLocation } from '@shared/data-access/models'
import { newGuid } from '@shared/utils'

export interface IFreePanelModel {
  id: string
  location: XyLocation
  backgroundColor: BackgroundColor
  rotation: PanelRotationConfig
  isSelected: boolean
  type: FreeBlockType
}

export class FreePanelModel implements IFreePanelModel {
  id: string
  location: XyLocation
  backgroundColor: BackgroundColor
  isSelected = false
  rotation: PanelRotationConfig
  type: FreeBlockType = FreeBlockType.Panel

  constructor(
    location: XyLocation,
    backgroundColor: BackgroundColor = PanelColorState.Default,
    rotation: PanelRotationConfig = PanelRotationConfig.Portrait,
  ) {
    this.id = newGuid()
    this.location = location
    this.backgroundColor = backgroundColor
    this.rotation = rotation
  }

  /*  update(changes: Partial<FreePanelModel>): FreePanelModel {
   return Object.assign(this, changes)
   }*/
}

/*
 export type PanelModel = {
 id: string
 location: Point
 backgroundColor: BackgroundColor
 rotation: PanelRotationConfig
 type: FreeBlockType
 }

 export const PanelModel = {
 create: (
 location: Point,
 backgroundColor: BackgroundColor = PanelColorState.Default,
 rotation: PanelRotationConfig = PanelRotationConfig.Portrait,
 ): PanelModel => ({
 id: newGuid(),
 location,
 backgroundColor,
 rotation,
 type: FreeBlockType.Panel,
 }),
 } as const*/

// const newPanel = Panel.create({ x: 0, y: 0 })

export const FreeBlockType = {
  Panel: 'panel',
} as const

export type FreeBlockType = (typeof FreeBlockType)[keyof typeof FreeBlockType]

export function isFreePanelModel(model: IFreePanelModel): model is FreePanelModel {
  return model.type === FreeBlockType.Panel
}

export function isFreePanelModelArray(models: IFreePanelModel[]): models is FreePanelModel[] {
  return models.every(isFreePanelModel)
}

export function isFreeBlockType(type: string): type is FreeBlockType {
  return Object.values(FreeBlockType).includes(type as FreeBlockType)
}

/*
 function isValidInvoice(invoice: Invoice): invoice is SalesInvoices {
 return invoice.amount > 100 && invoice.country === "ES";
 }*/