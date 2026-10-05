import { ChevronDown } from 'lucide-react'
import { availabilityMeta } from '../../data/mockData.js'
import { cn } from '../../utils/cn.js'

function toggleSelection(list, value) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value]
}

function FilterGroup({
  title,
  options,
  selected,
  onToggleValue,
  isOpen,
  onToggleOpen,
}) {
  return (
    <section className="rounded-2xl border border-navy/10 bg-white/70 p-3 dark:border-cream/10 dark:bg-night/35">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        onClick={onToggleOpen}
      >
        <h3 className="font-semibold">{title}</h3>
        <ChevronDown className={cn('size-4 transition', isOpen ? 'rotate-180' : '')} />
      </button>

      {isOpen ? (
        <div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-navy/8 dark:hover:bg-white/10"
            >
              <span className="line-clamp-1">{option.label}</span>
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => onToggleValue(option.value)}
                className="h-4 w-4 rounded border-navy/30 text-terracotta focus:ring-terracotta"
              />
            </label>
          ))}
        </div>
      ) : null}
    </section>
  )
}

function FilterSidebar({ books, filters, setFilters, openGroups, toggleGroup }) {
  const genres = [...new Set(books.map((book) => book.genre))]
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({ value, label: value }))
  const authors = [...new Set(books.map((book) => book.author))]
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({ value, label: value }))
  const years = [...new Set(books.map((book) => book.year))]
    .sort((a, b) => b - a)
    .map((value) => ({ value, label: String(value) }))
  const statuses = Object.entries(availabilityMeta).map(([key, item]) => ({
    value: key,
    label: item.label,
  }))

  return (
    <aside className="space-y-3" aria-label="Catalog filters">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          type="button"
          className="text-xs font-semibold text-terracotta"
          onClick={() =>
            setFilters({
              genres: [],
              authors: [],
              years: [],
              statuses: [],
            })
          }
        >
          Reset
        </button>
      </div>

      <FilterGroup
        title="Genre"
        options={genres}
        selected={filters.genres}
        isOpen={openGroups.genre}
        onToggleOpen={() => toggleGroup('genre')}
        onToggleValue={(value) =>
          setFilters((prev) => ({ ...prev, genres: toggleSelection(prev.genres, value) }))
        }
      />

      <FilterGroup
        title="Author"
        options={authors}
        selected={filters.authors}
        isOpen={openGroups.author}
        onToggleOpen={() => toggleGroup('author')}
        onToggleValue={(value) =>
          setFilters((prev) => ({ ...prev, authors: toggleSelection(prev.authors, value) }))
        }
      />

      <FilterGroup
        title="Publication Year"
        options={years}
        selected={filters.years}
        isOpen={openGroups.year}
        onToggleOpen={() => toggleGroup('year')}
        onToggleValue={(value) =>
          setFilters((prev) => ({ ...prev, years: toggleSelection(prev.years, value) }))
        }
      />

      <FilterGroup
        title="Availability"
        options={statuses}
        selected={filters.statuses}
        isOpen={openGroups.availability}
        onToggleOpen={() => toggleGroup('availability')}
        onToggleValue={(value) =>
          setFilters((prev) => ({ ...prev, statuses: toggleSelection(prev.statuses, value) }))
        }
      />
    </aside>
  )
}

export default FilterSidebar
