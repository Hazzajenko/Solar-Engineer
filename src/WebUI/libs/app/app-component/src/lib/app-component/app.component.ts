import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { BaseService } from '@shared/logger'
import { RouterOutlet } from '@angular/router'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent extends BaseService {
}
