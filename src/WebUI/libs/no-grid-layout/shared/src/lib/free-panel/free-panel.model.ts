import { BackgroundColor } from '../colors'
import { PanelColorState, PanelRotationConfig } from './free-panel.config'
import { Point } from '@shared/data-access/models'
import { newGuid } from '@shared/utils'

export interface IFreePanelModel {
  id: string
  location: {
    x: number
    y: number
  }
  backgroundColor: BackgroundColor
  rotation: PanelRotationConfig
  type: FreeBlockType
}

export class FreePanelModel implements IFreePanelModel {
  id: string
  location: Point
  backgroundColor: BackgroundColor
  isSelected = false
  rotation: PanelRotationConfig
  type: FreeBlockType = FreeBlockType.Panel

  constructor(
    location: Point,
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