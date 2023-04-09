import { PanelModel } from '.'
import { EntityType } from '@design-app/shared'

export function isPanelModel(model: PanelModel): model is PanelModel {
  return model.type === EntityType.Panel
}

export function isPanelModelArray(models: PanelModel[]): models is PanelModel[] {
  return models.every(isPanelModel)
}

export function isDesignEntityType(type: string): type is EntityType {
  return Object.values(EntityType).includes(type as EntityType)
}