import type { CSSProperties } from 'react'
import { brandPalette, defaultColors } from '../../../shared/lib/brand-palette'

const presets = [
  { name: 'Forest', primary: '#24634b', secondary: '#7c6651' },
  { name: 'Ocean', primary: '#245b91', secondary: '#607487' },
  { name: 'Plum', primary: '#74518b', secondary: '#817060' },
  { name: 'Terracotta', primary: '#a14932', secondary: '#69714d' },
]
export default function BrandColors({
  primary,
  secondary,
  onChange,
}: {
  primary?: string
  secondary?: string
  onChange: (key: 'primaryColor' | 'secondaryColor', value: string) => void
}) {
  const p = primary ?? defaultColors.primaryColor,
    s = secondary ?? defaultColors.secondaryColor
  const selected =
    presets.find((item) => item.primary === p && item.secondary === s)?.name ?? 'Custom'
  return (
    <section className="brand-color-settings">
      <h2>Brand colors</h2>
      <div className="brand-color-controls">
        <label>
          Color preset
          <select
            value={selected}
            onChange={(event) => {
              const preset = presets.find((item) => item.name === event.target.value)
              if (preset) {
                onChange('primaryColor', preset.primary)
                onChange('secondaryColor', preset.secondary)
              }
            }}
          >
            {presets.map((item) => (
              <option key={item.name}>{item.name}</option>
            ))}
            <option value="Custom">Custom</option>
          </select>
        </label>
        <label>
          Primary color
          <span className="brand-color-picker">
            <input
              type="color"
              aria-label="Primary color"
              value={p}
              onChange={(event) => onChange('primaryColor', event.target.value)}
            />
            <code>{p}</code>
          </span>
        </label>
        <label>
          Secondary color
          <span className="brand-color-picker">
            <input
              type="color"
              aria-label="Secondary color"
              value={s}
              onChange={(event) => onChange('secondaryColor', event.target.value)}
            />
            <code>{s}</code>
          </span>
        </label>
      </div>
      <div className="brand-color-previews">
        {[false, true].map((dark) => (
          <div
            key={String(dark)}
            className="brand-color-preview"
            style={brandPalette(p, s, dark) as CSSProperties}
          >
            <strong>{dark ? 'Dark mode' : 'Light mode'}</strong>
            <p>Library text and navigation</p>
            <div className="brand-preview-actions">
              <span className="brand-preview-primary">Primary action</span>
              <span className="brand-preview-secondary">Secondary action</span>
            </div>
          </div>
        ))}
      </div>
      <p className="muted">
        Readable shades and button text are generated separately for each mode.
      </p>
    </section>
  )
}
