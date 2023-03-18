import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BaseService } from '@shared/logger'

@Component({
  selector: 'app-bg-not-found',
  templateUrl: 'bg-not-found.component.html',
  styles: [],
  imports: [CommonModule],
  standalone: true,
})
export class BgNotFoundComponent extends BaseService {}
