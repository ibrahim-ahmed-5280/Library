import { usePagedList } from '../../../shared/hooks/usePagedList'
import Pagination from '../../../shared/components/Pagination'
import { Input } from '../../../shared/components/primitives/input'
import { Button } from '../../../shared/components/primitives/button'
import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import type { Book } from '../../../shared/types'
import {
  Empty,
  ErrorState,
  Loading,
  Modal,
  PageHeading,
  Status,
} from '../../../shared/components/ui'
import BookForm from '../components/BookForm'
import CopyManager from '../components/CopyManager'

export default function InventoryPage() {
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState<Book | 'new' | null>(null)
  const [copies, setCopies] = useState<Book | null>(null)
  const books = usePagedList<Book>('inventory', '/staff/books', `q=${encodeURIComponent(search)}`)
  const filtered = books.data
  return (
    <>
      <PageHeading
        eyebrow="COLLECTION MANAGEMENT"
        title="Books & physical copies"
        description="Keep titles, shelf locations, and copy records in order."
      >
        <Button className="button" onClick={() => setEditor('new')}>
          <Plus size={18} />
          Add title
        </Button>
      </PageHeading>
      <section className="panel">
        <div className="table-toolbar">
          <div className="search-input">
            <Search size={18} />
            <Input
              aria-label="Search inventory"
              placeholder="Search title, author, or ISBN"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <span className="muted">{books.total} titles</span>
        </div>
        {books.isPending ? (
          <Loading />
        ) : books.error ? (
          <ErrorState error={books.error} />
        ) : filtered.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Title / author</th>
                  <th>ISBN</th>
                  <th>Genre</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((book) => (
                  <tr key={book._id}>
                    <td>
                      <strong>{book.title}</strong>
                      <small>{book.author}</small>
                    </td>
                    <td className="mono">{book.isbn}</td>
                    <td>{book.genre}</td>
                    <td>{book.year}</td>
                    <td>
                      <Status value={book.archived ? 'archived' : 'active'} />
                    </td>
                    <td>
                      <div className="button-row">
                        <Button className="button secondary small" onClick={() => setEditor(book)}>
                          Edit
                        </Button>
                        <Button className="button secondary small" onClick={() => setCopies(book)}>
                          Copies
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty title={search ? 'No matching titles' : 'Build your library collection'}>
            <p className="muted">Add a title, then add its physical copies.</p>
          </Empty>
        )}
        <Pagination
          page={books.page}
          pages={books.pages}
          total={books.total}
          setPage={books.setPage}
        />
      </section>
      <Modal
        title={editor === 'new' ? 'Add a title' : 'Edit title'}
        description="Catalog metadata belongs to the title. Barcodes belong to physical copies."
        open={!!editor}
        onOpenChange={(open) => {
          if (!open) setEditor(null)
        }}
      >
        {editor && (
          <BookForm
            key={editor === 'new' ? 'new' : editor._id}
            book={editor === 'new' ? undefined : editor}
            onSaved={() => setEditor(null)}
          />
        )}
      </Modal>
      <Modal
        title={`Copies: ${copies?.title ?? ''}`}
        description="Each physical copy needs a unique barcode and a shelf location."
        open={!!copies}
        onOpenChange={(open) => {
          if (!open) setCopies(null)
        }}
      >
        {copies && <CopyManager book={copies} />}
      </Modal>
    </>
  )
}
