import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { FriendModel } from '@shared/data-access/models'

export const FriendsActions = createActionGroup({
  source: 'Friends Store',
  events: {
    'Init Friends': emptyProps(),
    'Add Friend': props<{ friend: FriendModel }>(),
    'Add Many Friends': props<{ friends: FriendModel[] }>(),
    'Accept Friend Request': props<{ friendUsername: string }>(),
    'Remove Friend': props<{ friendUsername: string }>(),
    'Clear Friends State': emptyProps(),
  },
})
