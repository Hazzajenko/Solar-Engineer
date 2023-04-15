import { EntityType } from '@design-app/shared'
import { Point } from '@shared/data-access/models'

export type PanelModel = {
  id: string
  location: Point
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