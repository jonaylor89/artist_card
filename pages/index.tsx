import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'

import styles from '../styles/Home.module.css'
import SeoHeaders from './seo-headers'
import Output from './output'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export default function Home() {
  const [username, setUsername] = useState('')
  const [tempUsername, setTempUsername] = useState(username)

  return (
    <div className={styles.container}>
      <Head>
        <SeoHeaders username={username} />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Create your unique <span>Artist Card!</span>
        </h1>

        <div className={styles.usernameForm}>
          <form onSubmit={(event) => {
            event.preventDefault()
            setUsername(tempUsername)
          }}>
            <label htmlFor="username" className={styles.largeLabel}>Your Audius handle:</label>
            <div className={styles.row}>
              <input
                id="username"
                type="text"
                className={styles.usernameTextInput}
                value={tempUsername}
                placeholder=""
                onChange={(e) => setTempUsername(e.target.value)}
                required
              />
              <button type="submit" className={styles.generateButton}>
                <Image src="/arrow-icon.svg" color='white' alt="Image Icon" width={24} height={24} />
              </button>
            </div>
          </form>
        </div>

        {username && (
          <Output username={username} />
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://audius.co"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/audius.svg" alt="Audius Logo" width={72} height={18} />
          </span>
        </a>
      </footer>
    </div>
  )
}
