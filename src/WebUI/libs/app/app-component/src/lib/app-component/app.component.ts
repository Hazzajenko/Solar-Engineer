import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { BaseService } from '@shared/logger'
import { RouterOutlet } from '@angular/router'
import { HomeHeaderComponent } from '@home/ui'
import { FooterComponent } from '@shared/ui/footer'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HomeHeaderComponent,
    FooterComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent extends BaseService {
}
