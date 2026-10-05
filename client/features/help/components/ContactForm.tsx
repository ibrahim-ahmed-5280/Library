import { useRef } from 'react'
import { useAction } from '../../../shared/hooks/useAction'
import { Input } from '../../../shared/components/primitives/input'
import { Button } from '../../../shared/components/primitives/button'
import { MutationFeedback } from '../../../shared/components/ui'
export default function ContactForm() {
  const form = useRef<HTMLFormElement>(null)
  const action = useAction('/contact', 'POST', () => form.current?.reset())
  return (
    <section className="contact-form-panel" aria-labelledby="message-title">
      <h2 id="message-title">Send us a message</h2>
      <p className="muted">
        Tell us what you need help with. Your message will be available to the library team.
      </p>
      <form
        className="form-stack"
        ref={form}
        onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          action.mutate(Object.fromEntries(data))
        }}
      >
        <div className="form-grid">
          <label>
            Full name
            <Input
              name="name"
              placeholder="Enter your full name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
            />
          </label>
          <label>
            Email address
            <Input
              name="email"
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
            />
          </label>
        </div>
        <label>
          What is your message about?
          <select name="subject" required defaultValue="">
            <option value="" disabled>
              Select a topic
            </option>
            {['Borrowing', 'Membership', 'Reservations', 'Other'].map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
        </label>
        <label>
          Message
          <textarea
            name="message"
            rows={5}
            placeholder="Describe your question or request"
            required
            minLength={10}
            maxLength={3000}
          />
        </label>
        <small className="muted">Please do not include passwords or payment information.</small>
        <MutationFeedback
          error={action.error}
          success={action.isSuccess}
          message="Your message has been sent to the library team."
        />
        <Button disabled={action.isPending}>
          {action.isPending ? 'Sending...' : 'Send message'}
        </Button>
      </form>
    </section>
  )
}
