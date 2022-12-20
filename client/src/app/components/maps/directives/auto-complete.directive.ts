import { Directive, Input } from '@angular/core'
import { autoCompleteOptions } from '../utils/maps.settings'
import { GoogleMap } from '@angular/google-maps'
import { LatLngModel } from '../models/latLng.model'

@Directive({
  selector: '[autocompleteDirective]',
  standalone: true,
})
export class AutoCompleteDirective {
  @Input() map?: GoogleMap
  private autoComplete!: google.maps.places.Autocomplete

  @Input() set center(center: LatLngModel) {
    if (!center) return
    let options = autoCompleteOptions(center)
    const input = document.getElementById('autocomplete') as HTMLInputElement
    this.autoComplete = new google.maps.places.Autocomplete(input, options)
    this.autoComplete.addListener(
      'place_changed',
      (
        (that) => () =>
          this.fillInAddress(that)
      )(this),
    )
  }

  fillInAddress(that: this) {
    if (!this.map) return
    const place = that.autoComplete.getPlace()
    if (!place.geometry || !place.geometry.location) {
      window.alert("No details available for input: '" + place.name + "'")
      return
    }

    if (place.geometry.viewport) {
      this.map.fitBounds(place.geometry.viewport)
    } else {
      this.map.center = place.geometry.location
    }
  }
}
