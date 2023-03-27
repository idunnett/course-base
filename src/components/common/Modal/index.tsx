import { motion } from 'framer-motion'
import Backdrop from './Backdrop'
import { FC, ReactNode, useEffect } from 'react'
import styles from './Modal.module.css'

interface Props {
  children: ReactNode
  title?: ReactNode
  handleClose: () => void
  parentRef?: React.RefObject<HTMLDivElement>
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

const Modal: FC<Props> = ({ children, title, handleClose, parentRef }) => {
  useEffect(() => {
    const pageSection = document.getElementById('page-section')
    if (pageSection) pageSection.style.overflow = 'hidden'
    return () => {
      if (pageSection) pageSection.style.overflow = 'auto'
    }
  }, [])

  return (
    <Backdrop onClick={handleClose}>
      <div className="h-full w-2/3 overflow-auto pb-12 scrollbar-hide">
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className={`${styles.modal} bg-white dark:bg-zinc-700`}
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {title && (
            <h1 className="text-slate-600 dark:text-neutral-100">{title}</h1>
          )}
          {children}
        </motion.div>
      </div>
    </Backdrop>
  )
}

export default Modal
