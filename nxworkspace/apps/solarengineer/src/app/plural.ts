import { Injectable } from '@angular/core'
import {
  DefaultHttpUrlGenerator,
  HttpResourceUrls,
  normalizeRoot,
  Pluralizer,
} from '@ngrx/data'
import { environment } from '../environments/environment'

@Injectable({ providedIn: 'root' })
export class CustomPlural extends Pluralizer {
  constructor()
    {
      super()
    }


  pluralize(name: string): string {
    return ''
  }
}
