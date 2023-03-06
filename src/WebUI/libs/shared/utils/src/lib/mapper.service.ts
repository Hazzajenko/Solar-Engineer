/*
import { Injectable } from '@angular/core'
import {
  GroupChatMessageModel,
  GroupChatServerMessageModel,
  MessageFrom,
} from '@shared/data-access/models'

export type MapType = GroupChatServerMessageModel | GroupChatMessageModel

@Injectable({
  providedIn: 'root',
})
export class MapperService {
  map(object: MapType) {
    if (this.instanceOfA(object)) {
      return {
        ...object,
      } as GroupChatMessageModel
    }
    return object
  }

  instanceOfA(object: GroupChatServerMessageModel): object is GroupChatServerMessageModel {
    return object.messageFrom === MessageFrom.Server
    // return 'member' in object
  }
}
*/
