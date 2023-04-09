import { EntityType } from '@design-app/shared'
import { XyLocation } from '@shared/data-access/models'

export type PanelModel = {
  id: string
  location: XyLocation
  rotation: PanelRotation
  stringId: string
  type: EntityType
}

export const PanelRotation = {
  Default: 'portrait',
  Portrait: 'portrait',
  Landscape: 'landscape',
} as const

export type PanelRotation = (typeof PanelRotation)[keyof typeof PanelRotation]