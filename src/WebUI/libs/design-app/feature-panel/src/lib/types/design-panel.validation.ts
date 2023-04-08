import { DesignPanelModel } from '.'
import { DesignEntityType } from '@design-app/shared'

export function isDesignPanelModel(model: DesignPanelModel): model is DesignPanelModel {
  return model.type === DesignEntityType.Panel
}

export function isDesignPanelModelArray(models: DesignPanelModel[]): models is DesignPanelModel[] {
  return models.every(isDesignPanelModel)
}

export function isDesignEntityType(type: string): type is DesignEntityType {
  return Object.values(DesignEntityType).includes(type as DesignEntityType)
}