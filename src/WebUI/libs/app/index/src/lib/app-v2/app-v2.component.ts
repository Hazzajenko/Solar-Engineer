import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { BaseService } from '@shared/logger'
import { HomeHeaderComponent } from '@home/ui'
import { RouterOutlet } from '@angular/router'
import { FooterComponent } from '@shared/ui/footer'
import { LetModule } from '@ngrx/component'
import { CoreComponentsAngularModule } from 'core-components-angular'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    HomeHeaderComponent,
    RouterOutlet,
    FooterComponent,
    LetModule,
    CoreComponentsAngularModule,
  ],
  selector: 'app-root',
  templateUrl: './app-v2.component.html',
  styles: [],
})
export class AppV2Component extends BaseService implements OnInit {
  ngOnInit(): void {}
}
