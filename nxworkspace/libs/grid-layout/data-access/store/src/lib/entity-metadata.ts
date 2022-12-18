import { EntityDataModuleConfig, EntityMetadataMap } from '@ngrx/data'
import { DisconnectionPointModel, PanelLinkModel, PanelModel, StringModel, TrayModel } from '@shared/data-access/models'

export const entityMetadata: EntityMetadataMap = {
  String: {
    selectId: (b: StringModel): string => b.id,
    entityDispatcherOptions: {
      optimisticUpdate: true,
      optimisticAdd: true,
      optimisticDelete: true,
    },
  },
  Panel: {
    selectId: (b: PanelModel): string => b.id,
    entityDispatcherOptions: {
      optimisticUpdate: true,
      optimisticAdd: true,
      optimisticDelete: true,
      optimisticSaveEntities: true,
    },
  },
  PanelLink: {
    selectId: (b: PanelLinkModel): string => b.id,
    entityDispatcherOptions: {
      optimisticUpdate: true,
      optimisticAdd: true,
      optimisticDelete: true,
      optimisticSaveEntities: true,
    },
  },
  DisconnectionPoint: {
    selectId: (b: DisconnectionPointModel): string => b.id,
    entityDispatcherOptions: {
      optimisticUpdate: true,
      optimisticAdd: true,
      optimisticDelete: true,
    },
  },
  Tray: {
    selectId: (b: TrayModel): string => b.id,
    entityDispatcherOptions: {
      optimisticUpdate: true,
      optimisticAdd: true,
      optimisticDelete: true,
    },
  },
}

const pluralNames = {}

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames,
}
