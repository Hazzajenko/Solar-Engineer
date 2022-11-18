import { EntityDataModuleConfig, EntityMetadataMap } from '@ngrx/data'
import { PanelModel } from './projects/models/panel.model'
import { CableModel } from './projects/models/cable.model'

const entityMetadata: EntityMetadataMap = {
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
}

const pluralNames = {}

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames,
}
