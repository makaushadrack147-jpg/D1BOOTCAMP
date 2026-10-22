export interface User {
  id: number
  username: string
  email: string
}

export interface Contributor extends User {
  contributorId: number
}

export interface Story {
  id: number
  title: string
  content: string
  authorId: number
  authorName: string
  createdAt: string
  updatedAt: string
  contributors: Contributor[]
}

export interface Comment {
  id: number
  storyId: number
  userId: number
  username: string
  content: string
  createdAt: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}
