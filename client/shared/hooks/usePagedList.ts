import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
interface Page<T> {
  items: T[]
  total: number
  page: number
  pages: number
  limit: number
}
export function usePagedList<T>(key: string, path: string, filters = '') {
  const [cursor, setCursor] = useState({ filters, page: 1 })
  const page = cursor.filters === filters ? cursor.page : 1
  const result = useQuery({
    queryKey: [key, 'paged', page, filters],
    queryFn: () => api<Page<T>>(`${path}?page=${page}&limit=25${filters ? `&${filters}` : ''}`),
  })
  return {
    ...result,
    data: result.data?.items ?? [],
    total: result.data?.total ?? 0,
    pages: result.data?.pages ?? 1,
    page,
    setPage: (next: number) => setCursor({ filters, page: next }),
  }
}
