import { ChangeDetectionStrategy, Component } from '@angular/core'
import { BaseService } from '@shared/logger'
import {CommonModule, NgOptimizedImage} from '@angular/common'
import { newReleasePost } from '@shared/data-access/models'
import { of } from 'rxjs'
import { LineBreaksToHtmlPipe } from '@shared/utils'

@Component({
  selector: 'app-blog-post',
  standalone: true,
	imports: [CommonModule, LineBreaksToHtmlPipe, NgOptimizedImage],
  templateUrl: './blog-post.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPostComponent extends BaseService {
  post = newReleasePost()
  post$ = of(newReleasePost())
}
