import { Component } from '@angular/core'
import { NgForOf } from '@angular/common'
import { KeyMapKeys } from './key-map.keys'

@Component({
  selector:    'app-key-map-component',
  templateUrl: './key-map.component.html',
  standalone:  true,
  imports:     [
    NgForOf,
  ],
})
export class KeyMapComponent {
  keys = KeyMapKeys
}