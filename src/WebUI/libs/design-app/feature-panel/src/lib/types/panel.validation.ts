import { PanelModel } from '.'
import { ENTITY_TYPE, EntityType } from '@design-app/shared'

export function isPanelModel(model: PanelModel): model is PanelModel {
  return model.type === ENTITY_TYPE.Panel
}

export function isPanelModelArray(models: PanelModel[]): models is PanelModel[] {
  return models.every(isPanelModel)
}

export function isDesignEntityType(type: string): type is EntityType {
  return Object.values(type).includes(type as EntityType)
}