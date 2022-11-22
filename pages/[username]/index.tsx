import Head from 'next/head'
import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

import styles from '../../styles/Home.module.css'
import SeoHeaders from '../seo-headers'
import { pageTitle } from '../seo-headers'
import CopyInput from './copy-input'


export default function Home() {
  const [username, setUsername] = useUsername()
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
          <div className="relative">
            <div className="z-0 absolute inset-0 flex justify-center items-center text-slate-400 text-sm">
              Loading… (can take a few seconds)
            </div>
            <div className="z-10 relative">
              <div
                dangerouslySetInnerHTML={{
                  __html: htmlCodeForUserName(username, dark, removeLink),
                }} />
            </div>

            <a
              href={imageUrlForUsername(username, dark, removeLink)}
              download={`${username}-audius-business-card.png`}
              className={styles.downloadButton}
            >
              Download
            </a>

            <div className={styles.outputLinks}>
              <div className={styles.outputLink}>
                <label htmlFor="imageUrl">Image URL:</label>
                <CopyInput
                  id="imageUrl"
                  readOnly
                  value={imageUrlForUsername(username, dark, removeLink)} />
              </div>
              <div className={styles.outputLink}>
                <label htmlFor="htmlCode">Embed HTML code:</label>
                <CopyInput
                  id="htmlCode"
                  readOnly
                  value={htmlCodeForUserName(username, dark, removeLink)} />
              </div>
              <div className={styles.outputLink}>
                <label htmlFor="markdownCode">Embed Markdown code:</label>
                <CopyInput
                  id="markdownCode"
                  readOnly
                  value={markdownCodeForUserName(username, dark, removeLink)} />
              </div>
            </div>
          </div>
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
  const params = [dark && 'dark', removeLink && 'removeLink'].filter(Boolean)
  return `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?username=${encodeURIComponent(
    username
  )}${params.length > 0 ? `?${params.join('&')}` : ''}`
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
  return `<a href="https://audius.co/${username}" target="_blank" rel="noopener noreferrer"><img src="${imageUrl}" alt="${imageAlt}" width="600" height="314" />`
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

function useUsername(): [
  string,
  (username: string, updateUrl?: boolean) => void
] {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const pathUser = pathname?.replace(/^\//, '')
  const searchUser = searchParams.get('user')

  console.log('pathname ', pathname?.toString())
  console.log('searchparams ', searchParams.toString())

  const [user, setUser] = useState(pathUser || searchUser || '')

  const setUsername = useCallback(
    (username: string, updateUrl = true) => {
      if (updateUrl) {
        router.replace(`/${username}`)
        document.title = pageTitle(username)
      }
      setUser(username)
    },
    [router]
  )

  useEffect(() => {
    if (searchUser && searchUser !== pathUser) {
      setUsername(searchUser)
    }
  }, [pathUser, searchUser, setUsername])

  return [user, setUsername]
}