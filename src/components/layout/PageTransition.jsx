import { motion as Motion } from 'framer-motion'

function PageTransition({ children }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      {children}
    </Motion.div>
  )
}

export default PageTransition
