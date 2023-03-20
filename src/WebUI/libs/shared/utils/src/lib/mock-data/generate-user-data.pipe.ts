import { Pipe, PipeTransform } from '@angular/core'
import { GenerateUserData } from '@shared/data-access/models'

@Pipe({
  name: 'generateUserData',
  standalone: true,
})
export class GenerateUserDataPipe implements PipeTransform {
  transform(value: number) {
    return GenerateUserData(value)
  }
}
