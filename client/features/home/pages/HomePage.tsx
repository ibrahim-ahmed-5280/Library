import { useQuery } from '@tanstack/react-query'
import { api } from '../../../shared/lib/api'
import type { BookList } from '../../../shared/types'
import HomeHero from '../components/HomeHero'
import CollectionSection from '../components/CollectionSection'
import LibraryGuide from '../components/LibraryGuide'
import MembershipBanner from '../components/MembershipBanner'
import '../styles/home.css'

export default function HomePage() {
  const books = useQuery({
    queryKey: ['books', 'home'],
    queryFn: () => api<BookList>('/books?sort=newest&limit=4'),
  })
  return (
    <div className="home-page">
      <HomeHero genres={books.data?.genres ?? []} />
      <div className="container">
        <CollectionSection
          books={books.data?.items ?? []}
          loading={books.isPending}
          error={books.error}
          onRetry={() => {
            void books.refetch()
          }}
        />
        <LibraryGuide />
        <MembershipBanner />
      </div>
    </div>
  )
}
