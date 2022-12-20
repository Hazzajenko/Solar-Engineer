import { Directive, HostListener, OnDestroy } from '@angular/core'
import { LatLngModel } from '../models/latLng.model'

@Directive({
  selector: '[mapsDirective]',
  standalone: true,
})
export class MapsDirective implements OnDestroy {
  @HostListener('document:contextmenu', ['$event'])
  onDocumentRightClick(event: any) {
    console.log(event)
  }

  onRightClick(event: google.maps.MapMouseEvent) {
    event.domEvent.preventDefault()

    const lat = event.latLng?.lat()
    const lng = event.latLng?.lng()
    if (!lat || !lng) {
      return console.error('could not get lat and long from map')
    }

    const data = new LatLngModel(lat, lng)

    const mouseEvent: any = {
      ...event,
    }
    /*
        this.menuTopLeftPosition.x = mouseEvent.domEvent.clientX! + 10 + 'px'
        this.menuTopLeftPosition.y = mouseEvent.domEvent.clientY! + 10 + 'px'
        this.matMenuTrigger.menuData = { data }
        this.matMenuTrigger.openMenu()*/
  }

  /*
    ngAfterViewInit(): void {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        console.log({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        const defaultBounds = {
          north: this.center.lat + 0.1,
          south: this.center.lat - 0.1,
          east: this.center.lng + 0.1,
          west: this.center.lng - 0.1,
        }
        const input = document.getElementById('autocomplete') as HTMLInputElement
        const options = {
          bounds: defaultBounds,
          componentRestrictions: { country: ['AU'] },
          fields: ['address_components', 'geometry', 'icon', 'name'],
          strictBounds: false,
          types: ['establishment'],
        }
        let autocomplete = new google.maps.places.Autocomplete(input, options)
        autocomplete.addListener(
          'place_changed',
          (
            (that) => () =>
              this.fillInAddress(that)
          )(this),
        )
      })
    }
  */

  /*  fillInAddress(that: this) {
          const place = that.autocomplete.getPlace()
          if (!place.geometry || !place.geometry.location) {
            window.alert("No details available for input: '" + place.name + "'")
            return
          }

          if (place.geometry.viewport) {
            this.map.fitBounds(place.geometry.viewport)
          } else {
            this.map.center = place.geometry.location
          }
    }*/

  /*  onRightClick(event: google.maps.MapMouseEvent) {
      event.domEvent.preventDefault()

      const lat = event.latLng?.lat()
      const lng = event.latLng?.lng()
      if (!lat || !lng) {
        return console.error('could not get lat and long from map')
      }

      const data = new LatLngModel(lat, lng)

      const mouseEvent: any = {
        ...event,
      }

      this.menuTopLeftPosition.x = mouseEvent.domEvent.clientX! + 10 + 'px'
      this.menuTopLeftPosition.y = mouseEvent.domEvent.clientY! + 10 + 'px'
      this.matMenuTrigger.menuData = { data }
      this.matMenuTrigger.openMenu()
    }*/

  ngOnDestroy(): void {
    // this.#subscription.unsubscribe()
  }
}
