import { AnimatePresence, motion as Motion } from 'framer-motion'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) {
      return undefined
    }

    const onEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onEscape)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onEscape)
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open ? (
        <Motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="surface-card max-h-[92vh] w-full max-w-3xl overflow-y-auto p-6 sm:p-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <h2 className="text-2xl font-semibold">{title}</h2>
              <button
                type="button"
                className="rounded-full p-2 text-navy/70 transition hover:bg-navy/10 dark:text-cream/80 dark:hover:bg-white/10"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X className="size-5" />
              </button>
            </div>
            {children}
          </Motion.div>
        </Motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

export default Modal
