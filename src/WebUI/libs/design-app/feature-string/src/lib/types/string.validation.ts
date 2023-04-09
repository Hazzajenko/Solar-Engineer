import { StringModel } from '.'
import { EntityType } from '@design-app/shared'

export function isDesignStringModel(model: StringModel): model is StringModel {
  return model.type === EntityType.String
}

export function isDesignPanelModelArray(models: StringModel[]): models is StringModel[] {
  return models.every(isDesignStringModel)
}