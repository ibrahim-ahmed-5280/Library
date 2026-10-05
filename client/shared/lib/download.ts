import { api } from './api'
export async function downloadReport(path: string, filename: string) {
  const blob = await api<Blob>(path)
  const url = URL.createObjectURL(blob),
    link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
