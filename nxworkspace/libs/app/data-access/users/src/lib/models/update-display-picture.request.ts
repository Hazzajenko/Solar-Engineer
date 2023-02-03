import { S3ImageModel } from '@shared/data-access/models'

export interface UpdateDisplayPictureRequest {
  userName: string
  image: S3ImageModel
}
