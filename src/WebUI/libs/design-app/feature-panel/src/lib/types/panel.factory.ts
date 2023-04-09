import { PanelModel, PanelRotation } from '.'
import { EntityType } from '@design-app/shared'
import { UndefinedString, XyLocation } from '@shared/data-access/models'
import { newGuid } from '@shared/utils'

export const PanelFactory = {
  create: (
    location: XyLocation,
    stringId: string = UndefinedString,
    rotation: PanelRotation = PanelRotation.Portrait,
  ): PanelModel => ({
    id: newGuid(),
    stringId,
    location,
    rotation,
    type: EntityType.Panel,
  }),
  oppositeRotation: (rotation: PanelRotation) => {
    switch (rotation) {
      case PanelRotation.Portrait:
        return PanelRotation.Landscape
      case PanelRotation.Landscape:
        return PanelRotation.Portrait
      default:
        return PanelRotation.Portrait
    }
  },
  size: (rotation: PanelRotation) => {
    switch (rotation) {
      case PanelRotation.Portrait:
        return { width: 18, height: 23 }
      case PanelRotation.Landscape:
        return { width: 23, height: 18 }
      default:
        return { width: 18, height: 23 }
    }
  },
} as const