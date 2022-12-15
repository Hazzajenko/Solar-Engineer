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
import { DOCUMENT, NgIf } from '@angular/common'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { NgxCaptureModule, NgxCaptureService } from 'ngx-capture'
import { firstValueFrom } from 'rxjs'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'

@Component({
  selector: 'app-maps',
  templateUrl: 'maps.component.html',
  styleUrls: ['maps.component.scss'],
  imports: [GoogleMapsModule, NgIf, ReactiveFormsModule, MatButtonModule, NgxCaptureModule],
  standalone: true,
})
export class MapsComponent implements OnInit, AfterViewInit {
  @ViewChild('screen', { static: true }) screen: any
  @ViewChild('autocomplete') input!: ElementRef<HTMLInputElement>
  done!: boolean
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap
  address = new FormControl('')
  zoom = 18
  center!: google.maps.LatLngLiteral
  imgBase64: any = ''
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    disableDefaultUI: false,
    clickableIcons: false,
    isFractionalZoomEnabled: true,

    // maxZoom: 15,
    // minZoom: 8,
  }
  autocomplete!: google.maps.places.Autocomplete

  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef,
    private captureService: NgxCaptureService,
    private http: HttpClient,
  ) {}

  ngAfterViewInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      /*      this.center = {
              lat: -37.86870604264376,
              lng: 145.24076695341796,
            }*/
      const defaultBounds = {
        north: this.center.lat + 0.1,
        south: this.center.lat - 0.1,
        east: this.center.lng + 0.1,
        west: this.center.lng - 0.1,
      }
      /*    let autocomplete = new google.maps.places.Autocomplete(this.input.nativeElement, {
            types: ['establishment'],
            componentRestrictions: { country: ['AU'] },
            fields: ['place_id', 'geometry', 'name'],
          })*/
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
    })
    /*    const center = { lat: 50.064192, lng: -130.605469 }
        const defaultBounds = {
          north: center.lat + 0.1,
          south: center.lat - 0.1,
          east: center.lng + 0.1,
          west: center.lng - 0.1,
        }*/
    /*    this.center = {
          lat: -37.86870604264376,
          lng: 145.24076695341796,
        }*/
    /*    const defaultBounds = {
          north: this.center.lat + 0.1,
          south: this.center.lat - 0.1,
          east: this.center.lng + 0.1,
          west: this.center.lng - 0.1,
        }
        /!*    let autocomplete = new google.maps.places.Autocomplete(this.input.nativeElement, {
              types: ['establishment'],
              componentRestrictions: { country: ['AU'] },
              fields: ['place_id', 'geometry', 'name'],
            })*!/
        const input = document.getElementById('autocomplete') as HTMLInputElement
        const options = {
          bounds: defaultBounds,
          componentRestrictions: { country: 'us' },
          fields: ['address_components', 'geometry', 'icon', 'name'],
          strictBounds: false,
          types: ['establishment'],
        }

        const autocomplete = new google.maps.places.Autocomplete(input, options)*/
  }

  ngOnInit() {
    /*    navigator.geolocation.getCurrentPosition((position) => {
          /!*      this.center = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                }*!/
          this.center = {
            lat: -37.86870604264376,
            lng: 145.24076695341796,
          }
        })*/
  }

  logCenter() {
    console.log(JSON.stringify(this.map.getCenter()))
  }

  zoomIn() {
    if (this.zoom < this.options.maxZoom!) this.zoom++
  }

  zoomOut() {
    if (this.zoom > this.options.minZoom!) this.zoom--
  }

  click(event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) {
    console.log(event)
  }

  enterAddress() {
    console.log(this.address)
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

  capture() {
    firstValueFrom(this.captureService.getImage(this.screen.nativeElement, true)).then((img) => {
      console.log(img)
      this.imgBase64 = img
      this.save()
    })
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

  save() {
    const formData = new FormData()
    // formData.append('file', fileToUpload, fileToUpload.name);
    const file = this.DataURIToBlob(this.imgBase64)
    console.log(file)
    // const formData = new FormData()
    formData.append('file', file, 'image.png')
    // const file2: File = this.imgBase64
    const myReader: FileReader = new FileReader()

    /*    myReader.onloadend = (e) => {
          this.imgBase64 = myReader.result
        }
        myReader.readAsDataURL(file)*/
    this.http
      .post('/api/files/map', formData, { reportProgress: true, observe: 'events' })
      .subscribe({
        next: (event) => {
          console.log(event)
          /*          if (event.type === HttpEventType.UploadProgress)
                      // this.progress = Math.round(100 * event.loaded / event.total);
                    else if (event.type === HttpEventType.Response) {
                      // this.message = 'Upload success.';
                      // this.onUploadFinished.emit(event.body);
                    }*/
        },
        error: (err: HttpErrorResponse) => console.log(err),
      })
    let url = 'upload2.php'
    /*    this.http
          .post(
            '/api/files/map',
            {
              formData,
            },
            { responseType: 'blob' },
          )
          .subscribe((data) => {
            console.log(data)
          })*/
  }
}
