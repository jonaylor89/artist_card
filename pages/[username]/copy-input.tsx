import { useEffect, useRef, useState } from 'react'
import styles from '../../styles/Home.module.css'

export default function CopyInput(props: JSX.IntrinsicElements['input']) {
  const [buttonText, setButtonText] = useState('Copy')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div className={styles.row}>
      <input className="flex-1" type="text" {...props} />
      <button
        type="button"
        onClick={() => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current)

          if (props.value && 'clipboard' in navigator) {
            navigator.clipboard.writeText(String(props.value))
            setButtonText('Copied!')
            timeoutRef.current = setTimeout(() => {
              setButtonText('Copy')
            }, 5000)
          }
        }}
      >
        {buttonText}
      </button>
    </div>
  )
}