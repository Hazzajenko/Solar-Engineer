import { Update } from '@ngrx/entity'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { EntityModel } from '@shared/data-access/models'

export const EntitiesActions = createActionGroup({
  source: 'Entities Store',
  events: {
    'Add Entity For Grid': props<{ entity: EntityModel }>(),
    'Add Many Entities For Grid': props<{ entities: EntityModel[] }>(),
    'Update Entity For Grid': props<{ update: Update<EntityModel> }>(),
    'Update Many Entities For Grid': props<{ updates: Update<EntityModel>[] }>(),
    'Delete Entity For Grid': props<{ entityId: string }>(),
    'Delete Many Entities For Grid': props<{ entityIds: string[] }>(),
    'Clear Entities State': emptyProps(),
  },
})
