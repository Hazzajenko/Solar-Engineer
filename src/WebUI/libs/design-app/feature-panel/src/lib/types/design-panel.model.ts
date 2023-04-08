import { DesignEntityType } from '@design-app/shared'
import { XyLocation } from '@shared/data-access/models'

export type DesignPanelModel = {
  id: string
  location: XyLocation
  rotation: PanelRotation
  stringId: string
  type: DesignEntityType
}

export const PanelRotation = {
  Default: 'portrait',
  Portrait: 'portrait',
  Landscape: 'landscape',
} as const

export type PanelRotation = (typeof PanelRotation)[keyof typeof PanelRotation]