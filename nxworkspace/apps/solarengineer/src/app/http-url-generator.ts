import { Injectable } from '@angular/core'
import { DefaultHttpUrlGenerator, HttpResourceUrls, normalizeRoot, Pluralizer } from '@ngrx/data'
import { environment } from '../environments/environment'

@Injectable()
export class CustomHttpUrlGenerator extends DefaultHttpUrlGenerator {
  constructor(private myPluralizer: Pluralizer) {
    super(myPluralizer)
  }

  protected override getResourceUrls(entityName: string, root: string): HttpResourceUrls {
    let resourceUrls = this.knownHttpResourceUrls[entityName]
    if (!resourceUrls) {
      const nRoot = normalizeRoot(root)
      const backend = environment.apiUrl
      const url = `${backend}/projects/3/${this.myPluralizer.pluralize(entityName)}`.toLowerCase()
      resourceUrls = {
        entityResourceUrl: url,
        collectionResourceUrl: url,
      }
      this.registerHttpResourceUrls({ [entityName]: resourceUrls })
    }
    return resourceUrls
  }
}
