import { S3ImageModel } from '@shared/data-access/models'

export interface GetDefaultImagesResponse {
  images: S3ImageModel[]
}
