export class ImageRequest {
  imageUrl: string
  imageName: string

  constructor(imageUrl: string, imageName: string) {
    this.imageUrl = imageUrl
    this.imageName = imageName
  }
}
