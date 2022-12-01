import { EntityDataModuleConfig, EntityMetadataMap } from '@ngrx/data'
import { PanelModel } from './projects/models/panel.model'
import { CableModel } from './projects/models/cable.model'
import { StringModel } from './projects/models/string.model'
import { TrackerModel } from './projects/models/tracker.model'
import { InverterModel } from './projects/models/inverter.model'
import { JoinModel } from './projects/models/join.model'
import { LinkModel } from './projects/models/link.model'
import { DisconnectionPointModel } from './projects/models/disconnection-point.model'
import { TrayModel } from './projects/models/tray.model'

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
  Link: {
    selectId: (b: LinkModel): string => b.id,
    entityDispatcherOptions: {
      optimisticUpdate: true,
      optimisticAdd: true,
      optimisticDelete: true,
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
