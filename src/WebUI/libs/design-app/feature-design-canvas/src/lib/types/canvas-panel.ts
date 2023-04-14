import {
  CanvasEntity,
  EntityFactory,
  StringId,
  UndefinedStringId,
} from '@design-app/feature-design-canvas'
import { ENTITY_TYPE } from '@design-app/shared'
import { UpdateStr } from '@ngrx/entity/src/models'
import { XyLocation } from '@shared/data-access/models'

export type CanvasPanel = Omit<CanvasEntity, 'id' | 'type'> & {
  id: PanelId
  stringId: StringId
  type: 'panel'
}

export type PanelId = string & {
  readonly _type: 'panelId'
}

export function isPanel(entity: CanvasEntity): entity is CanvasPanel {
  return entity.type === ENTITY_TYPE.Panel
}

export function assertIsPanel(entity: CanvasEntity): asserts entity is CanvasPanel {
  if (!isPanel(entity)) {
    throw new Error(`Expected entity to be a panel, but was ${entity.type}`)
  }
}

export const createPanel = (
  location: XyLocation,
  stringId: StringId = UndefinedStringId,
): CanvasPanel => {
  return {
    ...EntityFactory.create(ENTITY_TYPE.Panel, location),
    stringId,
  } as CanvasEntity & {
    id: PanelId
    stringId: StringId
  }
}

export const PanelFactory = {
  create: (stringId: StringId, location: XyLocation): CanvasPanel => {
    return {
      ...EntityFactory.create(ENTITY_TYPE.Panel, location),
      stringId,
    } as CanvasEntity & {
      id: PanelId
      stringId: StringId
    }
  },
  update: (panel: CanvasPanel, changes: Partial<CanvasPanel>): CanvasPanel => {
    return {
      ...EntityFactory.update(panel, changes),
      ...changes,
    } as CanvasEntity & {
      id: PanelId
      stringId: StringId
    }
  },
  updateForStore: (
    panelId: PanelId | string,
    changes: Partial<CanvasPanel>,
  ): UpdateStr<CanvasPanel> => {
    return {
      id: panelId,
      changes,
    }
  },
}