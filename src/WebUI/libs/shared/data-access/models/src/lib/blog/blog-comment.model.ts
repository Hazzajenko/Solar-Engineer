export interface BlogCommentModel {
  id: string
  postId: string
  authorId: string
  authorDisplayName: string
  authorPhotoUrl: string
  content: string
  publishedTime: Date
  updatedTime: Date
}
