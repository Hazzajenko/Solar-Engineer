import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BaseService } from '@shared/logger'

@Component({
  selector: 'app-split-image-not-found',
  templateUrl: 'split-image-not-found.component.html',
  styles: [],
  imports: [CommonModule],
  standalone: true,
})
export class SplitImageNotFoundComponent extends BaseService {}
