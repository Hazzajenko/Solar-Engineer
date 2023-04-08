import { DesignStringModel } from '.'
import { DesignEntityType } from '@design-app/shared'

export function isDesignStringModel(model: DesignStringModel): model is DesignStringModel {
  return model.type === DesignEntityType.String
}

export function isDesignPanelModelArray(
  models: DesignStringModel[],
): models is DesignStringModel[] {
  return models.every(isDesignStringModel)
}