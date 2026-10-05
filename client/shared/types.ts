import type { Role } from '../../server/contracts/schemas'
export interface User {
  avatarId?: string | null
  _id: string
  name: string
  email: string
  role: Role
  status: 'active' | 'suspended'
  emailVerified?: boolean
  savedBooks?: string[]
}
export interface Book {
  coverId?: string | null
  _id: string
  title: string
  author: string
  isbn: string
  genre: string
  year: number
  description: string
  archived: boolean
  copies?: { total: number; available: number }
  inventory?: Copy[]
}
export interface Copy {
  _id: string
  book: Book | string
  barcode: string
  shelf: string
  status: 'available' | 'on_loan' | 'retired'
}
export interface Loan {
  _id: string
  book: Book
  member: User
  copy: Copy
  dueAt: string
  createdAt: string
  returnedAt: string | null
  renewals: number
}
export interface Reservation {
  _id: string
  book: Book
  member: User
  status: 'waiting' | 'fulfilled' | 'cancelled'
  createdAt: string
}
export interface AuditEntry {
  _id: string
  actor: User
  action: string
  entity: string
  createdAt: string
}
export interface Report {
  totalLoans: number
  returnedLoans: number
  membership: { _id: { role: string; status: string }; count: number }[]
  reservationStatuses: { _id: string; count: number }[]
  monthly: { _id: string; issued: number }[]
  popularTitles: { _id: string; title?: string; loans: number }[]
  genres: { _id: string; count: number }[]
  overdueTotal: number
  titles: number
  copies: number
  members: number
  activeLoans: number
  waiting: number
  overdue: Loan[]
  recent: AuditEntry[]
  inventory: { _id: string; count: number }[]
}
export interface BookList {
  items: Book[]
  total: number
  genres: string[]
  page: number
  pages: number
}
export interface Notification {
  _id: string
  message: string
  read: boolean
  createdAt: string
}
