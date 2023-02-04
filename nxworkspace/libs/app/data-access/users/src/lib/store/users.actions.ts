import { Update } from '@ngrx/entity'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { AppUserLinkModel, S3ImageModel, UserModel } from '@shared/data-access/models'
import { UpdateDisplayPictureRequest } from '../models'

export const UsersActions = createActionGroup({
  source: 'Users Store',
  events: {
    'Init Users': emptyProps(),
    'Update AppUser Display Picture With Icon': props<{ request: UpdateDisplayPictureRequest }>(),
    'Send Friend Request': props<{ userName: string }>(),
    'Accept Friend Request': props<{ userName: string }>(),
    'Reject Friend Request': props<{ userName: string }>(),
    'Get User By UserName': props<{ userName: string }>(),
    'Add User': props<{ user: AppUserLinkModel }>(),
    'Add Many Users': props<{ users: AppUserLinkModel[] }>(),
    'Update User': props<{ update: Update<AppUserLinkModel> }>(),
    'Update Many Users': props<{ updates: Update<AppUserLinkModel>[] }>(),
    'Remove User': props<{ userUserName: string }>(),
    'Remove Many Users': props<{ userUserNames: string[] }>(),
    'Clear Users State': emptyProps(),
  },
})
