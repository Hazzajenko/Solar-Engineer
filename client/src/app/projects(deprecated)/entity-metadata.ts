import { EntityDataModuleConfig, EntityMetadataMap } from '@ngrx/data'
import { PanelModel } from './models/panel.model'
import { CableModel } from './models/deprecated-for-now/cable.model'
import { StringModel } from './models/string.model'
import { TrackerModel } from './models/deprecated-for-now/tracker.model'
import { InverterModel } from './models/deprecated-for-now/inverter.model'
import { JoinModel } from './models/deprecated-for-now/join.model'
import { PanelLinkModel } from './models/panel-link.model'
import { DisconnectionPointModel } from './models/disconnection-point.model'
import { TrayModel } from './models/deprecated-for-now/tray.model'
import { RailModel } from './models/deprecated-for-now/rail.model'
import { BlockModel } from './models/block.model'

const entityMetadata: EntityMetadataMap = {
  Inverter: {
    selectId: (b: InverterModel): string => b.id,
    entityDispatcherOptions: {
      optimisticUpdate: true,
      optimisticAdd: true,
      optimisticDelete: true,
    },
  },
  Tracker: {
    selectId: (b: TrackerModel): string => b.id,
    entityDispatcherOptions: {
      optimisticUpdate: true,
      optimisticAdd: true,
      optimisticDelete: true,
    },
  },
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
  Cable: {
    selectId: (b: CableModel): string => b.id,
    entityDispatcherOptions: {
      optimisticUpdate: true,
      optimisticAdd: true,
      optimisticDelete: true,
    },
  },
  Join: {
    selectId: (b: JoinModel): string => b.id,
    entityDispatcherOptions: {
      optimisticUpdate: true,
      optimisticAdd: true,
      optimisticDelete: true,
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
  Rail: {
    selectId: (b: RailModel): string => b.id,
    entityDispatcherOptions: {
      optimisticUpdate: true,
      optimisticAdd: true,
      optimisticDelete: true,
    },
  },
  Block: {
    selectId: (b: BlockModel): string => b.id,
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
