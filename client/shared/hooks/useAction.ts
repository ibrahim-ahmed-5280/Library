import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api, body } from '../lib/api'
export function useAction<T = unknown>(
  path: string,
  method = 'POST',
  onSuccess?: (data: T) => void,
) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (input?: unknown) =>
      api<T>(path, { method, ...(input === undefined ? {} : { body: body(input) }) }),
    onError: (error) => toast.error(error.message, { id: error.message, duration: 7000 }),
    onSuccess: (data) => {
      const message =
        path === '/contact'
          ? 'Your message has been sent to the library team.'
          : path.endsWith('/renew')
            ? 'Renewed.'
            : path.endsWith('/return')
              ? 'Book returned.'
              : method === 'POST' && /\/books\/[^/]+\/copies$/.test(path)
                ? 'Copy added to inventory.'
                : path === '/reservations' && method === 'POST'
                  ? 'Your reservation is recorded. Track it in My library.'
                  : 'Changes saved.'
      const responseMessage =
        data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
          ? data.message
          : message
      toast.success(responseMessage)
      void client.invalidateQueries()
      onSuccess?.(data)
    },
  })
}
