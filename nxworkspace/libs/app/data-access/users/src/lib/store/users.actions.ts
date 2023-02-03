import { Update } from '@ngrx/entity'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { S3ImageModel, UserModel } from '@shared/data-access/models'
import { UpdateDisplayPictureRequest } from '../models'

export const UsersActions = createActionGroup({
  source: 'Users Store',
  events: {
    'Init Users': emptyProps(),
    'Update AppUser Display Picture With Icon': props<{ request: UpdateDisplayPictureRequest }>(),
    'Get User By UserName': props<{ userName: string }>(),
    'Add User': props<{ user: UserModel }>(),
    'Add Many Users': props<{ users: UserModel[] }>(),
    'Update User': props<{ update: Update<UserModel> }>(),
    'Update Many Users': props<{ updates: Update<UserModel>[] }>(),
    'Remove User': props<{ userUserName: string }>(),
    'Remove Many Users': props<{ userUserNames: string[] }>(),
    'Clear Users State': emptyProps(),
  },
})
