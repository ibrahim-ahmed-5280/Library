import { Button } from './primitives/button'
export default function Pagination({
  page,
  pages,
  total,
  setPage,
}: {
  page: number
  pages: number
  total: number
  setPage: (page: number) => void
}) {
  return (
    <nav className="list-pagination" aria-label="List pagination">
      <span className="muted">
        {total} records | Page {page} of {pages}
      </span>
      <div className="button-row">
        <Button
          type="button"
          variant="outline"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={page >= pages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </nav>
  )
}
