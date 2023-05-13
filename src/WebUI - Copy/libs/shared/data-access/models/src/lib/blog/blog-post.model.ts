import { BlogCommentModel } from './blog-comment.model'

export interface BlogPostModel {
  id: string
  title: string
  description: string
  content: string
  authorId: string
  authorDisplayName: string
  authorPhotoUrl: string
  publishedTime: Date
  updatedTime: Date
  tags: string[]
  comments: BlogCommentModel[]
}
