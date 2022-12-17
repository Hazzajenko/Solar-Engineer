import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { lastValueFrom } from 'rxjs'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-image-edit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageEditComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>
  angle: number = 0
  image: HTMLImageElement = new Image()
  imageSrc?: string | undefined
  private http = inject(HttpClient)
  private sanitizer = inject(DomSanitizer)
  private ctx!: CanvasRenderingContext2D

  async ngOnInit() {}

  async createImage(image: Blob) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onloadend = () => {
        const base64data = reader.result
        resolve(base64data)
      }
    })
  }

  async ngAfterViewInit() {
    let canvas = this.canvas.nativeElement
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.width = this.canvas.nativeElement.offsetWidth
    canvas.height = this.canvas.nativeElement.offsetHeight

    this.ctx = this.canvas.nativeElement.getContext('2d')!

    let image = new Image()

    image.onload = () => {
      let w = canvas.width
      let nw = image.naturalWidth
      let nh = image.naturalHeight
      let aspect = nw / nh
      let h = w / aspect
      this.ctx.drawImage(image, 0, 0, w, h)
      // this.ctx.drawImage(image, 0, 650, 400, 200/aspect, 0, 0, w, h)
    }
    const blob = await lastValueFrom(
      this.http.get('/api/files/background', { responseType: 'blob' }),
    )

    this.createImage(blob).then((src) => {
      image.src = `${src}`
    })

    const greyScale = () => {
      let imgData = this.ctx.getImageData(0, 0, canvas.width, canvas.height)

      let arr = imgData.data
      for (let i = 0; i < arr.length; i = i + 4) {
        let ttl = arr[i] + arr[i + 1] + arr[i + 2]
        let avg = parseInt(String(ttl / 3))
        arr[i] = avg //red
        arr[i + 1] = avg //green
        arr[i + 2] = avg //blue
      }
      // imgData.data = arr;
      Object.defineProperties(imgData, {
        data: {
          value: arr,
          writable: true,
        },
      })
      this.ctx.putImageData(imgData, 0, 0)
    }
    const colorChannel = () => {
      let imgData = this.ctx.getImageData(
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height,
      )
      let arr = imgData.data
      for (let i = 0; i < arr.length; i = i + 4) {
        arr[i] = 0 //R
        //arr[i+1] = 0;   //G
        arr[i + 2] = 0 //B
      }
      // imgData.data = arr;
      Object.defineProperties(imgData, {
        data: {
          value: arr,
          writable: true,
        },
      })
      this.ctx.putImageData(imgData, 0, 0)

      let img = this.canvas.nativeElement.toDataURL('image/jpeg', 1.0)
      console.log(img)
      document.querySelector('img')!.src = img
    }

    canvas.addEventListener('click', colorChannel)
    // canvas.addEventListener('click', greyScale)

    // this.colorChannel()
    // this.greyScale()
  }

  greyScale() {
    let imgData = this.ctx.getImageData(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height,
    )

    let arr = imgData.data
    for (let i = 0; i < arr.length; i = i + 4) {
      let ttl = arr[i] + arr[i + 1] + arr[i + 2]
      let avg = parseInt(String(ttl / 3))
      arr[i] = avg //red
      arr[i + 1] = avg //green
      arr[i + 2] = avg //blue
    }
    // imgData.data = arr;
    Object.defineProperties(imgData, {
      data: {
        value: arr,
        writable: true,
      },
    })
    this.ctx.putImageData(imgData, 0, 0)
  }

  colorChannel() {
    let imgData = this.ctx.getImageData(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height,
    )
    let arr = imgData.data
    for (let i = 0; i < arr.length; i = i + 4) {
      arr[i] = 0 //R
      //arr[i+1] = 0;   //G
      arr[i + 2] = 0 //B
    }
    // imgData.data = arr;
    Object.defineProperties(imgData, {
      data: {
        value: arr,
        writable: true,
      },
    })
    this.ctx.putImageData(imgData, 0, 0)

    let img = this.canvas.nativeElement.toDataURL('image/jpeg', 1.0)
    console.log(img)
    document.querySelector('img')!.src = img
  }
}
