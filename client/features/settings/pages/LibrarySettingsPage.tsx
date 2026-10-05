import { useMutation, useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { toast } from 'sonner'
import { ImagePlus } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { api } from '../../../shared/lib/api'
import { useAction } from '../../../shared/hooks/useAction'
import type { LibraryDetails } from '../../../shared/hooks/useLibrarySettings'
import { Input } from '../../../shared/components/primitives/input'
import { Button } from '../../../shared/components/primitives/button'
import { Loading, ErrorState, PageHeading } from '../../../shared/components/ui'
import BrandColors from '../components/BrandColors'
import { defaultColors } from '../../../shared/lib/brand-palette'
function SettingsForm({ settings }: { settings: LibraryDetails }) {
  const form = useForm<LibraryDetails>({ defaultValues: { ...defaultColors, ...settings } })
  const action = useAction('/staff/settings', 'PUT')
  const logoInput = useRef<HTMLInputElement>(null)
  const logoId = useWatch({ control: form.control, name: 'logoId' })
  const primary = useWatch({ control: form.control, name: 'primaryColor' })
  const secondary = useWatch({ control: form.control, name: 'secondaryColor' })
  const upload = useMutation({
    mutationFn: (file: File) =>
      api<{ logoId: string }>('/staff/settings/logo', {
        method: 'POST',
        body: file,
        headers: { 'Content-Type': file.type },
      }),
    onSuccess: (data) => {
      form.setValue('logoId', data.logoId)
      toast.success('Logo ready. Save library details to apply it.')
    },
    onError: (error) => toast.error(error.message),
  })
  return (
    <form
      className="form-stack panel settings-form"
      onSubmit={form.handleSubmit((values) => action.mutate(values))}
    >
      <div className="branding-controls">
        {logoId && (
          <img
            className="business-logo-preview"
            src={`/api/covers/${logoId}`}
            alt="Business logo preview"
          />
        )}
        <input
          hidden
          type="file"
          ref={logoInput}
          aria-label="Business logo file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) {
              if (
                !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
                file.size > 5 * 1024 * 1024
              )
                toast.error('Choose a JPEG, PNG, or WebP logo up to 5 MB.')
              else upload.mutate(file)
            }
            event.target.value = ''
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={upload.isPending}
          onClick={() => logoInput.current?.click()}
        >
          <ImagePlus size={18} />
          {upload.isPending
            ? 'Uploading...'
            : logoId
              ? 'Change business logo'
              : 'Upload business logo'}
        </Button>
        {logoId && (
          <Button type="button" variant="ghost" onClick={() => form.setValue('logoId', null)}>
            Remove logo
          </Button>
        )}
        <label className="checkbox-label">
          <Input
            type="checkbox"
            {...form.register('showName')}
            defaultChecked={settings.showName !== false}
          />
          Show business name beside logo
        </label>
      </div>
      <BrandColors
        primary={primary}
        secondary={secondary}
        onChange={(key, value) => form.setValue(key, value)}
      />
      <div className="form-grid">
        {(
          [
            { key: 'name', label: 'Business name', hint: 'Enter the business name' },
            { key: 'email', label: 'Public contact email', hint: 'library@example.com' },
            { key: 'phone', label: 'Public phone', hint: '+252 ...' },
            { key: 'address', label: 'Address', hint: 'Enter your public address' },
            { key: 'hours', label: 'Opening hours', hint: 'e.g. Open 24 hours, every day' },
            { key: 'timezone', label: 'Timezone', hint: 'e.g. Africa/Mogadishu' },
          ] as const
        ).map((field) => (
          <label key={field.key}>
            {field.label}
            <Input
              placeholder={field.hint}
              type={field.key === 'email' ? 'email' : 'text'}
              required={['name', 'timezone'].includes(field.key)}
              {...form.register(field.key)}
            />
          </label>
        ))}
      </div>
      <label className="checkbox-label">
        <Input type="checkbox" {...form.register('emailEnabled')} />
        Enable email delivery
      </label>
      <label>
        Days before due date to start reminders
        <Input
          type="number"
          min={0}
          max={14}
          placeholder="e.g. 2"
          {...form.register('reminderDays', { valueAsNumber: true })}
        />
      </label>
      <Button disabled={action.isPending || upload.isPending}>
        {action.isPending ? 'Saving...' : 'Save library details'}
      </Button>
    </form>
  )
}
export default function LibrarySettingsPage() {
  const settings = useQuery({
    queryKey: ['admin-library-settings'],
    queryFn: () => api<LibraryDetails>('/staff/settings'),
  })
  return (
    <>
      <PageHeading
        eyebrow="LIBRARY CONFIGURATION"
        title="Library details"
        description="Manage the public name, contact details, opening hours, timezone, and email preferences."
      />
      {settings.isPending ? (
        <Loading />
      ) : settings.error ? (
        <ErrorState error={settings.error} />
      ) : (
        <SettingsForm settings={settings.data} />
      )}
    </>
  )
}
