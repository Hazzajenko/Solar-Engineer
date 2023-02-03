import { z } from 'zod'

export const UserSchema = z.object({
  email: z.string(),
  userName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  photoUrl: z.string(),
  created: z.string(),
  lastActive: z.string(),
  isOnline: z.boolean(),
})

export type UserType = z.infer<typeof UserSchema>

/*
email: string
firstName: string
lastName: string
userName: string
photoUrl: string
created: string
lastActive: string
isOnline: boolean*/
