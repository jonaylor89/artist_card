import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'

import styles from '../../styles/Home.module.css'
import SeoHeaders from '../seo-headers'
import Output from './output'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export default function Home() {
  const [username, setUsername] = useState('')
  const [dark, setDark] = useState(false)
  const [removeLink, setRemoveLink] = useState(false)
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
                <Image src="/image-icon.svg" color='white' alt="Image Icon" width={24} height={24} />
              </button>
            </div>
          </form>
        </div>

        <div className={styles.configurations}>
          <div className={styles.row}>
            <div className={styles.configurationItem}>
              <input
                id="dark"
                type="checkbox"
                checked={dark}
                onChange={(e) => setDark(e.target.checked)}
              />
              <label htmlFor="dark">Dark mode</label>
            </div>
            <div className={styles.configurationItem}>
              <input
                id="removeLink"
                type="checkbox"
                checked={removeLink}
                onChange={(e) => setRemoveLink(e.target.checked)}
              />
              <label htmlFor="removeLink">
                Remove <strong>audius.co</strong> link
              </label>
            </div>
          </div>
        </div>

        {username && (
          <Output username={username} dark={dark} removeLink={removeLink} />
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

function imageUrlForUsername(
  username: string,
  dark: boolean,
  removeLink: boolean
) {
  return `${baseUrl}/api/og?username=${encodeURIComponent(
    username
  )}&dark=${encodeURIComponent(dark)}&removeLink=${encodeURIComponent(removeLink)}`
}

function imageAltForUsername(username: string) {
  return `${username}’s Audius image`
}

function htmlCodeForUserName(
  username: string,
  dark: boolean,
  removeLink: boolean
) {
  const imageUrl = imageUrlForUsername(username, dark, removeLink)
  const imageAlt = imageAltForUsername(username)
  return `<a href="${imageUrl}" target="_blank" rel="noopener noreferrer"><img src="${imageUrl}" alt="${imageAlt}" width="600" height="314" />`
}

function markdownCodeForUserName(
  username: string,
  dark: boolean,
  removeLink: boolean
) {
  const imageUrl = imageUrlForUsername(username, dark, removeLink)
  const imageAlt = imageAltForUsername(username)
  return `![${imageAlt}](${imageUrl})`
}