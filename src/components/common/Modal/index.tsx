import { motion } from 'framer-motion'
import styles from './Modal.module.css'
import Backdrop from './Backdrop'
import { FC, ReactNode } from 'react'

interface Props {
  children: ReactNode
  title: ReactNode
  handleClose: () => void
}

const dropIn = {
  hidden: {
    y: '-100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.05,
      type: 'spring',
      damping: 30,
      stiffness: 500,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
  },
}

const Modal: FC<Props> = ({ children, title, handleClose }) => {
  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className={`${styles.modal} bg-white dark:bg-zinc-700`}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {title && (
          <h1 className="text-slate-500 dark:text-neutral-200">{title}</h1>
        )}
        {children}
      </motion.div>
    </Backdrop>
  )
}

export default Modal
