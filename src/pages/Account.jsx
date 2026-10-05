import { Bell, Bookmark, CreditCard, ShoppingBag } from 'lucide-react'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import { useLibrary } from '../context/LibraryContext.jsx'

function Account() {
  const { cartItems, savedItems } = useLibrary()

  return (
    <section className="section-shell pb-6">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-terracotta">
          Account
        </p>
        <h1 className="section-title mt-2">Welcome back, Reader</h1>
        <p className="mt-1 text-sm text-navy/72 dark:text-cream/72">
          Manage your loans, saved books, notifications, and membership benefits.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <ShoppingBag className="size-5 text-terracotta" />
          <p className="mt-2 text-sm text-navy/70 dark:text-cream/70">Borrow Cart</p>
          <p className="text-2xl font-semibold">{cartItems.length}</p>
        </Card>
        <Card className="p-4">
          <Bookmark className="size-5 text-terracotta" />
          <p className="mt-2 text-sm text-navy/70 dark:text-cream/70">Saved Books</p>
          <p className="text-2xl font-semibold">{savedItems.length}</p>
        </Card>
        <Card className="p-4">
          <Bell className="size-5 text-terracotta" />
          <p className="mt-2 text-sm text-navy/70 dark:text-cream/70">Notifications</p>
          <p className="text-2xl font-semibold">4</p>
        </Card>
        <Card className="p-4">
          <CreditCard className="size-5 text-terracotta" />
          <p className="mt-2 text-sm text-navy/70 dark:text-cream/70">Membership</p>
          <p className="text-2xl font-semibold">Research Plus</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-xl font-semibold">Current Loans</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="rounded-xl bg-navy/8 p-3 dark:bg-white/10">
              The Midnight Archive - Due March 22
            </li>
            <li className="rounded-xl bg-navy/8 p-3 dark:bg-white/10">
              Whispering Blueprints - Due March 26
            </li>
          </ul>
        </Card>

        <Card className="p-5">
          <h2 className="text-xl font-semibold">Account Shortcuts</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline">Renew Loans</Button>
            <Button variant="outline">Update Preferences</Button>
            <Button variant="outline">Contact Librarian</Button>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default Account
