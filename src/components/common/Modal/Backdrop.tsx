import { motion } from 'framer-motion'
import { FC, ReactNode } from 'react'
import styles from './Modal.module.css'

interface Props {
  children: ReactNode
  onClick: () => void
}

const Backdrop: FC<Props> = ({ children, onClick }) => {
  return (
    <motion.div
      className={styles.backdrop}
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  )
}

export default Backdrop
