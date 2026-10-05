import { useEffect, useRef, useState } from 'react'
import { Camera } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '../../../shared/lib/api'
import UserAvatar from '../../../shared/components/UserAvatar'
import { useAuth } from '../../auth/providers/AuthProvider'
import type { User } from '../../../shared/types'
import PhotoCropDialog from './PhotoCropDialog'

export default function ProfilePhoto({
  editing,
  onUploading,
}: {
  editing: boolean
  onUploading: (busy: boolean) => void
}) {
  const { user, updateUser } = useAuth()
  const input = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<File | null>(null)
  const queries = useQueryClient()
  const upload = useMutation({
    mutationFn: (file: File) =>
      api<User>('/me/avatar', {
        method: 'POST',
        body: file,
        headers: { 'Content-Type': file.type },
      }),
    onSuccess: (updated) => {
      updateUser(updated)
      void queries.invalidateQueries()
      toast.success('Profile photo updated.')
    },
    onError: (error) => toast.error(error.message),
  })
  useEffect(() => {
    onUploading(upload.isPending)
  }, [upload.isPending, onUploading])
  return (
    <div className="profile-photo-section">
      <div className="profile-photo">
        <UserAvatar user={user} large />
        {editing && (
          <button
            type="button"
            className="profile-camera"
            aria-label="Upload or change profile photo"
            disabled={upload.isPending}
            onClick={() => input.current?.click()}
          >
            <Camera size={19} aria-hidden="true" />
          </button>
        )}
      </div>
      {editing && (
        <>
          <input
            ref={input}
            type="file"
            hidden
            className="sr-only"
            tabIndex={-1}
            aria-label="Profile photo file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) {
                if (
                  !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
                  file.size > 5 * 1024 * 1024
                )
                  toast.error('Choose a JPEG, PNG, or WebP photo up to 5 MB.')
                else setSelected(file)
              }
              event.target.value = ''
            }}
          />
        </>
      )}
      {selected && (
        <PhotoCropDialog
          file={selected}
          onClose={() => setSelected(null)}
          onSave={(file) => {
            setSelected(null)
            upload.mutate(file)
          }}
        />
      )}
    </div>
  )
}
