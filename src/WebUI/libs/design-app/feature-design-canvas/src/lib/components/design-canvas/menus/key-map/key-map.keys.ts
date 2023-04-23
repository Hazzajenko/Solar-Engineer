import { KeyCategory } from './key-category'
import { CopyPasteKeys } from './key-types/copy-paste-keys'
import { GridKeys } from './key-types/grid-keys'
import { ObjectPositionKeys } from './key-types/object-position-keys'
import { StateManageKeys } from './key-types/state-manage-keys'
import { ViewPositionKeys } from './key-types/view-position-keys'


export type KeyMapKey = {
  key: string
  label: string
  category: KeyCategory
}

export const KeyMapKeys: KeyMapKey[] = [
  ...CopyPasteKeys,
  ...StateManageKeys,
  ...ObjectPositionKeys,
  ...ViewPositionKeys,
  ...GridKeys,
  /*  {
   key: 'CTRL + SHIFT + ALT',
   label: 'Rotate Selected 45°',
   }*/

  /*  {
   key:   'Ctrl + S',
   label: 'Save',
   }*/
]
/*
 const CopyPasteKeys = [
 {
 key:   'Ctrl + C',
 label: 'Copy',
 },
 {
 key:   'Ctrl + Z',
 label: 'Undo',
 },
 {
 key:   'Ctrl + Y',
 label: 'Redo',
 },
 {
 key:   'Ctrl + V',
 label: 'Paste',
 },
 {
 key:   'Ctrl + A',
 label: 'Select All',
 },
 {
 key:   'Ctrl + D',
 label: 'Duplicate',
 },
 ]
 */
/*export const KeyMapKeys = {
 copy: 'Ctrl + C',
 }*/