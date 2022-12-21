import { AfterViewInit, Component, inject, ViewChild } from '@angular/core'
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps'
import { AsyncPipe, NgIf } from '@angular/common'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { NgxCaptureModule } from 'ngx-capture'
import { HttpClientJsonpModule } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { LatLngModel } from './models/latLng.model'
import { MapsStore } from './data-access/maps.store'
import { MapsDirective } from './directives/maps.directive'
import { MapsService } from './data-access/maps.service'
import { AutoCompleteDirective } from './directives/auto-complete.directive'
import { mapsOptions } from './utils/maps.settings'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { SaveLocationDialog } from './ui/save-location-dialog/save-location.dialog'
import { ImagesService } from '../../shared/data-access/images/images.service'

@Component({
  selector: 'app-maps',
  templateUrl: 'maps.component.html',
  styleUrls: ['maps.component.scss'],
  imports: [
    GoogleMapsModule,
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    NgxCaptureModule,
    AsyncPipe,
    HttpClientJsonpModule,
    MatMenuModule,
    MapsDirective,
    AutoCompleteDirective,
  ],
  providers: [MapsStore],
  standalone: true,
})
export class MapsComponent implements AfterViewInit {
  @ViewChild(GoogleMap, { static: false }) map?: GoogleMap
  address = new FormControl('')
  zoom = 18
  center!: google.maps.LatLngLiteral

  options: google.maps.MapOptions = mapsOptions()
  mapsApiLoaded: boolean = false
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  private store = inject(MapsStore)
  private mapsService = inject(MapsService)
  private dialog = inject(MatDialog)
  private imagesService = inject(ImagesService)

  ngAfterViewInit(): void {
    this.mapsService.initMaps().then((google) => {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
      })
      this.mapsApiLoaded = true
    })
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

    this.menuTopLeftPosition.x = mouseEvent.domEvent.clientX! + 10 + 'px'
    this.menuTopLeftPosition.y = mouseEvent.domEvent.clientY! + 10 + 'px'
    this.matMenuTrigger.menuData = { data }
    this.matMenuTrigger.openMenu()
  }

  selectPosition(data: LatLngModel) {
    const center = `${data.lat},${data.lng}`
    const zoom = Math.floor(<number>this.map!.getZoom())
    const width = 600
    const height = 600

    const img =
      `https://maps.googleapis.com/maps/api/staticmap?center=` +
      `${center}&zoom=${zoom}&scale=2&size=${width}x${height}` +
      `&maptype=satellite&format=png&key=${environment.mapsApiKey}`
    /*    this.imagesService
          .saveImageAsync(new ImageRequest(img, 'testtest'))
          .then((res) => res.subscribe((sub) => console.log(sub)))*/
    console.log(img)

    const dialogConfig = new MatDialogConfig()

    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true

    dialogConfig.data = {
      imgSrc: img,
    }

    this.dialog.open(SaveLocationDialog, dialogConfig)
  }
}
