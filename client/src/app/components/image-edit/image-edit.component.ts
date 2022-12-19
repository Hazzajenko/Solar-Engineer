import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, HostListener,
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
  image?: HTMLImageElement
  backgroundBlob?: Blob
  imageSrc?: string | undefined
  mouseDownX?: number
  mouseDownY?: number
  mouseUpX?: number
  mouseUpY?: number
  startX: number = 0
  startY: number = 0
  offsetX: number = 0
  offsetY: number = 0
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
    this.offsetX = this.canvas.nativeElement.offsetLeft
    this.offsetY = this.canvas.nativeElement.offsetTop


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
    this.backgroundBlob = await lastValueFrom(
      this.http.get('/api/files/background', { responseType: 'blob' }),
    )

    this.createImage(this.backgroundBlob ).then((src) => {
      image.src = `${src}`
    })

    this.image = {
      ...image
    }

    const setImage = () => {
      // let imgData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
      let w = canvas.width
      let nw = image.naturalWidth
      let nh = image.naturalHeight
      let aspect = nw / nh
      let h = w / aspect
      this.ctx.drawImage(image, 0, 650, 400, 200/aspect, 0, 0, w, h)
      // this.ctx.drawImage(image, 100, 100, 100, 100);
    }
    const greyScale = () => {
      let imgData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);

      let arr = imgData.data;
      for(let i=0; i<arr.length; i=i+4){
        let ttl = arr[i] + arr[i+1] + arr[i+2];
        let avg = parseInt(String(ttl / 3));
        arr[i] = avg;   //red
        arr[i+1] = avg; //green
        arr[i+2] = avg; //blue
      }
      // imgData.data = arr;
      Object.defineProperties(imgData, {
        data: {
          value: arr,
          writable: true,
        },
      });
      this.ctx.putImageData(imgData, 0, 0);
    }
    const colorChannel = () => {
      let imgData = this.ctx.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      let arr = imgData.data;
      for(let i=0; i<arr.length; i=i+4){
        arr[i] = 0;     //R
        //arr[i+1] = 0;   //G
        arr[i+2] = 0;   //B
      }
      // imgData.data = arr;
      Object.defineProperties(imgData, {
        data: {
          value: arr,
          writable: true,
        },
      });
      this.ctx.putImageData(imgData, 0, 0);

      let img = this.canvas.nativeElement.toDataURL('image/jpeg', 1.0);
      console.log(img);
      document.querySelector('img')!.src = img;
    }
    // canvas.addEventListener('click', setImage)
    // canvas.addEventListener('click', colorChannel)
    // canvas.addEventListener('click', greyScale)


    // this.colorChannel()
    // this.greyScale()
  }

  greyScale(){
    let imgData = this.ctx.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    let arr = imgData.data;
    for(let i=0; i<arr.length; i=i+4){
      let ttl = arr[i] + arr[i+1] + arr[i+2];
      let avg = parseInt(String(ttl / 3));
      arr[i] = avg;   //red
      arr[i+1] = avg; //green
      arr[i+2] = avg; //blue
    }
    // imgData.data = arr;
    Object.defineProperties(imgData, {
      data: {
        value: arr,
        writable: true,
      },
    });
    this.ctx.putImageData(imgData, 0, 0);
  }

  colorChannel(){
    let imgData = this.ctx.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    let arr = imgData.data;
    for(let i=0; i<arr.length; i=i+4){
      arr[i] = 0;     //R
      //arr[i+1] = 0;   //G
      arr[i+2] = 0;   //B
    }
    // imgData.data = arr;
    Object.defineProperties(imgData, {
      data: {
        value: arr,
        writable: true,
      },
    });
    this.ctx.putImageData(imgData, 0, 0);

    let img = this.canvas.nativeElement.toDataURL('image/jpeg', 1.0);
    console.log(img);
    document.querySelector('img')!.src = img;
  }

  clickEvent(event: MouseEvent) {
    console.log(event)

  }

  mouseDown(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    const rect = this.canvas.nativeElement.getBoundingClientRect()
    this.startX = event.clientX - rect.left
    this.startY = event.clientY - rect.top
    this.mouseDownX = event.clientX
    this.mouseDownY = event.clientY
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
  }

  mouseUp(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    this.mouseUpX = event.clientX
    this.mouseUpY = event.clientY

    if (!this.image) return console.error('!image')

    let image = new Image()
    const rect = this.canvas.nativeElement.getBoundingClientRect()

    image.onload = () => {
      let w = this.canvas.nativeElement.width
      let nw = image.naturalWidth
      let nh = image.naturalHeight
      let aspect = nw / nh
      let h = w / aspect
      this.ctx.drawImage(image, 200, 200, 400, 400, 0, 0, w, h)
      console.log('draw')
      // this.ctx.drawImage(image, 0, 650, 400, 200/aspect, 0, 0, w, h)
    }

    // image.src = this.image.src
    if (!this.backgroundBlob) return console.error('!backgroundBlob')
    this.createImage(this.backgroundBlob).then((src) => {
      image.src = `${src}`
    })
/*    let w = this.canvas.nativeElement.width
    let nw = this.image.naturalWidth
    let nh = this.image.naturalHeight
    let aspect = nw / nh
    let h = w / aspect
    this.ctx.drawImage(this.image, 0, 650, 400, 200/aspect, 0, 0, w, h)*/
  }

  @HostListener('document:mousemove', ['$event'])
  onMultiDrag(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (this.startX && this.startY) {
      const mouseX = event.clientX - this.offsetX
      const mouseY = event.clientY - this.offsetY

      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)

      const width = mouseX - this.startX
      const height = mouseY - this.startY

      this.ctx.globalAlpha = 0.4

      this.ctx.fillStyle = '#7585d8'
      this.ctx.fillRect(this.startX, this.startY, width, height)

      this.ctx.globalAlpha = 1.0
    } else {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
    }
  }
}
