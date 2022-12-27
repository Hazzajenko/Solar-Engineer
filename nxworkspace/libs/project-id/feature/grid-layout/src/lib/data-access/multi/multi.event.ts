/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

import { BlockType, PanelModel } from "@shared/data-access/models"

export enum MultiEventType {
  SelectStart,
  SelectFinish,
  CreateStartPanel,
  CreateFinishPanel,
  CreateStartTray,
  CreateFinishTray,
  DeleteStart,
  DeleteFinish,
  Error,
}

export type MultiEvent =
  | {
      type: MultiEventType.SelectStart
      payload: {
        location: string
      }
    }
  | {
      type: MultiEventType.SelectFinish
      payload: {
        location: string
        ids: string[]
      }
  }
  | {
    type: MultiEventType.CreateStartPanel
    payload: {
      location: string,
    }
  }
| {
    type: MultiEventType.CreateFinishPanel
    payload: {
      location: string
      panels: PanelModel[]
    }
  }
  | {
    type: MultiEventType.Error
  }

export const sendMultiEvent = <Type extends MultiEvent['type']>(
  ...args: Extract<MultiEvent, { type: Type }> extends { payload: infer TPayload }
    ? [type: Type, payload: TPayload]
    : [type: Type]
) => {
  return args
}

export enum EventStage{
  START,
  FINISH
}


export enum EventAction{
  CREATE,
  SELECT,
  DELETE
}

export interface EventSwitchOptions {
/*   event: MultiEventType,
  state: EventStage, */
  type: BlockType,
  location: string
}

export function createMultiCreateEvent(options: EventSwitchOptions) {
  switch (options.type) {
    case BlockType.PANEL: {
     return sendMultiEvent(MultiEventType.CreateStartPanel, { location: options.location })
    }
    default:
      return sendMultiEvent(MultiEventType.Error)
  }
}

// sendMultiEvent(MultiEventType.CreateStartPanel, { location })
