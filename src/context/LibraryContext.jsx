/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { catalogBooks } from '../data/mockData.js'

const LibraryContext = createContext(null)

const defaultRecentSearches = [
  'Children storytime',
  'Modern African fiction',
  'Study room reservations',
]

export function LibraryProvider({ children }) {
  const [books] = useState(catalogBooks)
  const [cartItems, setCartItems] = useState([])
  const [savedItems, setSavedItems] = useState([])
  const [quickViewBook, setQuickViewBook] = useState(null)
  const [recentSearches, setRecentSearches] = useState(defaultRecentSearches)

  const addToCart = (bookId) => {
    setCartItems((prev) => (prev.includes(bookId) ? prev : [...prev, bookId]))
  }

  const toggleSaved = (bookId) => {
    setSavedItems((prev) =>
      prev.includes(bookId)
        ? prev.filter((savedId) => savedId !== bookId)
        : [...prev, bookId],
    )
  }

  const openQuickView = (book) => {
    setQuickViewBook(book)
  }

  const closeQuickView = () => {
    setQuickViewBook(null)
  }

  const addRecentSearch = (term) => {
    const cleaned = term.trim()
    if (!cleaned) {
      return
    }

    setRecentSearches((prev) => {
      const next = [cleaned, ...prev.filter((item) => item !== cleaned)]
      return next.slice(0, 6)
    })
  }

  const value = useMemo(
    () => ({
      books,
      cartItems,
      savedItems,
      quickViewBook,
      recentSearches,
      addToCart,
      toggleSaved,
      openQuickView,
      closeQuickView,
      addRecentSearch,
    }),
    [books, cartItems, savedItems, quickViewBook, recentSearches],
  )

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  )
}

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (!context) {
    throw new Error('useLibrary must be used within LibraryProvider')
  }
  return context
}
