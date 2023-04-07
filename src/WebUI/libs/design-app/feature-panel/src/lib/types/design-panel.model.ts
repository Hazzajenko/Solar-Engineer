import { PanelRotation } from './panel-rotation.type'
import { XyLocation } from '@shared/data-access/models'

export type DesignPanelModel = {
  id: string
  location: XyLocation
  rotation: PanelRotation
  type: DesignEntityType
}

export const DesignEntityType = {
  Panel: 'panel',
} as const

export type DesignEntityType = (typeof DesignEntityType)[keyof typeof DesignEntityType]

export function isDesignPanelModel(model: DesignPanelModel): model is DesignPanelModel {
  return model.type === DesignEntityType.Panel
}

export function isDesignPanelModelArray(models: DesignPanelModel[]): models is DesignPanelModel[] {
  return models.every(isDesignPanelModel)
}

export function isDesignEntityType(type: string): type is DesignEntityType {
  return Object.values(DesignEntityType).includes(type as DesignEntityType)
}