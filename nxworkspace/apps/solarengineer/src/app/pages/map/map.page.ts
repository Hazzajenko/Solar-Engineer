import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core'
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps'
import { AsyncPipe, DOCUMENT, NgIf } from '@angular/common'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { NgxCaptureModule, NgxCaptureService } from 'ngx-capture'
import { BehaviorSubject, firstValueFrom, Observable, of, takeUntil } from 'rxjs'
import { HttpClient, HttpClientJsonpModule, HttpErrorResponse, HttpEventType } from '@angular/common/http'
import { catchError, map, take } from 'rxjs/operators'
import { Loader } from '@googlemaps/js-api-loader'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { LatLngModel } from './latLng.model'
import { environment } from '../../../environments/environment'
import { PanelModel } from '@shared/data-access/models'



@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
  imports: [
    GoogleMapsModule,
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    NgxCaptureModule,
    AsyncPipe,
    HttpClientJsonpModule,
    MatMenuModule,
  ],
  standalone: true,
})
export class MapPage implements OnInit, AfterViewInit {
  @ViewChild('screen', { static: false }) screen!: ElementRef
  @ViewChild('autocomplete') input!: ElementRef<HTMLInputElement>
  done!: boolean
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap
  address = new FormControl('')
  zoom = 18
  center!: any
  // center!: google.maps.LatLngLiteral | google.maps.LatLng
  // center!: google.maps.LatLngLiteral
  imgBase64: any = ''
  tilt: number = 40
  options: google.maps.MapOptions = {
    mapTypeId: 'satellite',
    zoomControl: false,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    disableDefaultUI: true,
    clickableIcons: false,
    isFractionalZoomEnabled: true,
    noClear: true,
    rotateControl: true

  }
  autocomplete!: google.maps.places.Autocomplete
  imgUrl?: string
  apiLoaded!: BehaviorSubject<boolean>

  mapsApiLoaded: boolean = false
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  // centerr: any

  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef,
    private captureService: NgxCaptureService,
    private http: HttpClient,
  ) {}

  ngAfterViewInit(): void {
    const loader = new Loader({
      apiKey: environment.mapsApiKey,
      version: 'weekly',
      libraries: ['places'],
    })
    loader.load().then((google) => {

      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

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

        this.autocomplete = new google.maps.places.Autocomplete(input, options)
        this.autocomplete.addListener(
          'place_changed',
          (
            (that) => () =>
              this.fillInAddress(that)
          )(this),
        )
        this.mapsApiLoaded = true
      })
    })
  }

  ngOnInit() {
  }
  click(event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) {
    console.log(event)
  }

  fillInAddress(that: this) {
    const place = that.autocomplete.getPlace()
    if (!place.geometry || !place.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'")
      return
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      this.map.fitBounds(place.geometry.viewport)
    } else {
      this.map.center = place.geometry.location
      // this.map.setZoom(17);
    }

    // this.marker.setPosition(place.geometry.location);
    console.log(place)
    let address1 = ''
    let postcode = ''
  }

  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString =
      splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }
  saveImage(event: string) {
    console.log(event)
    const formData = new FormData()
    // formData.append('file', fileToUpload, fileToUpload.name);
    const file = this.DataURIToBlob(event)
    console.log(file)
    // const formData = new FormData()
    formData.append('file', file, 'image2.png')
    this.http
      .post('/api/files/map', formData, { reportProgress: true, observe: 'events' })
      .pipe(
        take(5)
      )
      .subscribe({
        next: (event) => {
          // console.log(event)
          if (event.type === HttpEventType.UploadProgress)
            console.log(Math.round(100 * event.loaded / event.total!))
          // this.progress = Math.round(100 * event.loaded / event.total);
          else if (event.type === HttpEventType.Response) {
            console.log('Upload success')
            // this.message = 'Upload success.';
            // this.onUploadFinished.emit(event.body);
          }
        },
        error: (err: HttpErrorResponse) => console.log(err),
        complete: () => console.log('saveImage complete')
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

  async selectPosition(data: LatLngModel) {
    const center = `${data.lat},${data.lng}`
    const zoom = Math.floor(<number>this.map.getZoom())
    console.log(zoom)
    const width = 600
    const height = 600

    const img =
      `https://maps.googleapis.com/maps/api/staticmap?center=`+
      `${center}&zoom=${zoom}&scale=2&size=${width}x${height}`+
      `&maptype=satellite&format=png&key=${environment.mapsApiKey}`
    console.log(img)

    const dataUrl: any = await this.getBase64FromUrl(img)
    this.saveImage(dataUrl)
    /*    this.getBase64FromUrl(img).then((dataUrl: any) => {
          console.log(dataUrl)
          this.saveImage(dataUrl)
        })*/
    // if (imgData)
    // this.saveImage(imgData)

  }

  async getBase64FromUrl  (url: string) {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      }
    });
  }
  toDataURL(url: string, callback: any) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  changeTilt() {
    /*    if (this.options.tilt) {
          this.options.tilt  = 100
        }*/

    console.log(this.map.googleMap?.getTilt())
    console.log(this.map.getTilt())
    // this.map.
    // this.map.googleMap?.setTilt(0)
    this.map.googleMap!.setTilt(45)
    this.map.googleMap!.setHeading(90)
    // this.tilt = 100
    // this.map.()

  }
}
