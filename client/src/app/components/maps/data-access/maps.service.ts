import { Injectable } from '@angular/core'
import { Loader } from '@googlemaps/js-api-loader'
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  initMaps() {
    const loader = new Loader({
      apiKey: environment.mapsApiKey,
      version: 'weekly',
      libraries: ['places'],
    })
    return loader.load()
  }
}
