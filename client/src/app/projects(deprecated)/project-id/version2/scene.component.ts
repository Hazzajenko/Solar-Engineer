import { Component, HostListener, OnInit } from '@angular/core'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { DraggableGridComponent } from './draggable-grid/draggable-grid.component'
import { SceneToolbarComponent } from './scene-toolbar/scene-toolbar.component'
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common'
import { SceneModel } from '../../models/scene.model'
import { HttpClient } from '@angular/common/http'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-scene-component',
  templateUrl: 'scene.component.html',
  styleUrls: ['scene.component.scss'],
  imports: [
    DragDropModule,
    DraggableGridComponent,
    SceneToolbarComponent,
    NgForOf,
    NgOptimizedImage,
    NgIf,
  ],
  standalone: true,
})
export class SceneComponent implements OnInit {
  dragPosition = { x: 0, y: 0 }
  scenes!: SceneModel[]
  background!: any
  public getScreenWidth: any
  public getScreenHeight: any

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
    this.getScreenHeight = window.innerHeight
  }

  ngOnInit() {
    this.getScreenWidth = window.innerWidth
    this.getScreenHeight = window.innerHeight
    this.scenes = [
      {
        rows: 10,
        cols: 10,
        xPosition: 0,
        yPosition: 0,
      },
    ]
    this.http.get('/api/files/background', { responseType: 'blob' }).subscribe((res) => {
      // this.background = res
      // let objectURL = 'data:image/jpeg;base64,' + res
      //
      // this.background = this.sanitizer.bypassSecurityTrustUrl(objectURL)
      this.createImageFromBlob(res)
      console.log(res)
    })
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader()
    reader.addEventListener(
      'load',
      () => {
        this.background = reader.result
      },
      false,
    )

    if (image) {
      reader.readAsDataURL(image)
    }
  }

  addScene(event: SceneModel) {
    this.scenes.push(event)
  }
}
