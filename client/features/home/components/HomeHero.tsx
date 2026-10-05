import { useLibrarySettings, defaultLibrary } from '../../../shared/hooks/useLibrarySettings'
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../../../shared/components/primitives/input'
import { Button } from '../../../shared/components/primitives/button'
import '../styles/hero.css'

export default function HomeHero({ genres }: { genres: string[] }) {
  const library = useLibrarySettings()
  const navigate = useNavigate()
  return (
    <section className="library-hero" aria-labelledby="home-title">
      <img
        className="library-hero-image"
        src="/images/library-hero.png"
        alt=""
        fetchPriority="high"
        width="1672"
        height="941"
      />
      <div className="library-hero-content">
        <p className="eyebrow">YOUR COMMUNITY LIBRARY</p>
        <h1 id="home-title">
          A place for your <span>next chapter.</span>
        </h1>
        <p className="library-hero-intro">
          A story that stays with you. An idea that opens a door. Find your next discovery at
          {library.data?.name ?? defaultLibrary.name}.
        </p>
        <form
          className="library-hero-search"
          onSubmit={(event) => {
            event.preventDefault()
            const query = new FormData(event.currentTarget).get('query')
            navigate(`/catalog?q=${encodeURIComponent(String(query ?? '').trim())}`)
          }}
        >
          <label className="sr-only" htmlFor="home-search">
            Search the library
          </label>
          <Search size={21} aria-hidden="true" />
          <Input id="home-search" name="query" placeholder="Title, author, or ISBN" />
          <Button type="submit">
            Find a book <ArrowRight size={18} aria-hidden="true" />
          </Button>
        </form>
        <div className="library-hero-topics">
          <span>Follow your curiosity</span>
          <div>
            {genres
              .slice()
              .sort()
              .slice(0, 4)
              .map((genre) => (
                <Link key={genre} to={`/catalog?genre=${encodeURIComponent(genre)}`}>
                  {genre}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </Link>
              ))}
          </div>
        </div>
        <Link to="/about" className="library-hero-about">
          A little more about your library <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
