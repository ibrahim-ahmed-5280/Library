import { useState } from 'react'
import { api } from '../../../shared/lib/api'
import { useAction } from '../../../shared/hooks/useAction'
import { Input } from '../../../shared/components/primitives/input'
import { Button } from '../../../shared/components/primitives/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bookSchema } from '../../../../server/contracts/schemas'
import type { z } from 'zod'
import type { Book } from '../../../shared/types'
import { MutationFeedback } from '../../../shared/components/ui'

export default function BookForm({ book, onSaved }: { book?: Book; onSaved: () => void }) {
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<Error | null>(null)
  const [uploading, setUploading] = useState(false)
  const form = useForm<z.input<typeof bookSchema>, unknown, z.output<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: book ?? {
      title: '',
      author: '',
      isbn: '',
      genre: '',
      year: new Date().getFullYear(),
      description: '',
      archived: false,
    },
  })
  const action = useAction(
    book ? `/staff/books/${book._id}` : '/staff/books',
    book ? 'PATCH' : 'POST',
    onSaved,
  )
  return (
    <form
      className="form-stack"
      onSubmit={form.handleSubmit(async (values) => {
        setUploadError(null)
        setUploading(true)
        try {
          if (coverFile) {
            const uploaded = await api<{ coverId: string }>('/staff/covers', {
              method: 'POST',
              body: coverFile,
              headers: { 'Content-Type': coverFile.type },
            })
            values.coverId = uploaded.coverId
          }
          action.mutate(values)
        } catch (error) {
          setUploadError(error as Error)
        } finally {
          setUploading(false)
        }
      })}
    >
      <div className="form-grid">
        {[
          { key: 'title', label: 'Title', placeholder: 'Enter the book title' },
          { key: 'author', label: 'Author', placeholder: 'Enter the author?s name' },
          {
            key: 'isbn',
            label: 'ISBN / catalog identifier',
            placeholder: 'e.g. 9780385474542 or CAT-0001',
          },
          { key: 'genre', label: 'Genre', placeholder: 'e.g. Fiction' },
          { key: 'year', label: 'Publication year', placeholder: 'e.g. 2024' },
        ].map(({ key, label, placeholder }) => (
          <label key={key}>
            {label}
            <Input
              placeholder={placeholder}
              type={key === 'year' ? 'number' : 'text'}
              {...form.register(key as 'title' | 'author' | 'isbn' | 'genre' | 'year')}
            />
            {form.formState.errors[key as keyof typeof form.formState.errors] && (
              <span className="form-error">
                {form.formState.errors[key as keyof typeof form.formState.errors]?.message}
              </span>
            )}
          </label>
        ))}
      </div>
      <label>
        Book cover (optional)
        <Input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null
            if (
              file &&
              (file.size > 5 * 1024 * 1024 ||
                !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
            ) {
              setUploadError(new Error('Choose a JPEG, PNG, or WebP image up to 5 MB.'))
              event.target.value = ''
              setCoverFile(null)
            } else {
              setUploadError(null)
              setCoverFile(file)
            }
          }}
        />
        <small className="muted">
          JPEG, PNG, or WebP, up to 5 MB. Leave empty to keep the current cover.
        </small>
      </label>
      {form.watch('coverId') && (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            form.setValue('coverId', null)
            setCoverFile(null)
          }}
        >
          Use title-and-author cover
        </Button>
      )}
      <label>
        Description
        <textarea
          placeholder="Describe the book and what readers can expect"
          rows={4}
          {...form.register('description')}
        />
      </label>
      {book && (
        <label className="checkbox-label">
          <Input type="checkbox" {...form.register('archived')} />
          Archive title (only when loans and reservations are resolved)
        </label>
      )}
      <MutationFeedback error={uploadError ?? action.error} />
      <Button className="button" disabled={action.isPending || uploading}>
        {action.isPending || uploading ? 'Saving...' : book ? 'Save changes' : 'Add title'}
      </Button>
    </form>
  )
}
