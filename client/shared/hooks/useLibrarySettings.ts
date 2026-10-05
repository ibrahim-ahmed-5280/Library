import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
export interface LibraryDetails {
  primaryColor?: string
  secondaryColor?: string
  logoId?: string | null
  showName?: boolean
  name: string
  email: string
  phone: string
  address: string
  hours: string
  timezone: string
  emailEnabled?: boolean
  reminderDays?: number
}
export const defaultLibrary: LibraryDetails = {
  name: 'Khaliil Library',
  email: '',
  phone: '',
  address: '',
  hours: '',
  timezone: 'Africa/Mogadishu',
}
export function useLibrarySettings() {
  return useQuery({
    queryKey: ['library-settings'],
    queryFn: () => api<LibraryDetails>('/library/settings'),
  })
}
