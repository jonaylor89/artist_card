import Head from 'next/head'
import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

import styles from '../../styles/Home.module.css'
import { pageTitle } from '../seo-headers'
import { randomTopUsername } from '../top-users'

export default function Home() {
    const [username, setUsername] = useUsername()
    // const [dark, setDark] = useState(false)
    // const [removeLink, setRemoveLink] = useState(false)
    const [tempUsername, setTempUsername] = useState(username)
    const [isBrowser, setIsBrowser] = useState(false)

    useEffect(() => {
        setIsBrowser(true)
    }, [])

    useEffect(() => {
        if (!username) {
            const randomUser = randomTopUsername()
            setUsername(randomUser, false)
            setTempUsername(randomUser)
        }
    }, [setUsername, username])

  return (
    <div className={styles.container}>
      <Head>
        <title>Artist Card</title>
        <meta name="description" content="Generate a unique artist business card" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Create your unique <span>Card!</span>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
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
    return `${process.env.NEXT_PUBLIC_BASE_URL}/i/${encodeURIComponent(
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
    const pathname = usePathname()!
    const searchParams = useSearchParams()!

    const pathUser = pathname.replace(/^\//, '')
    const searchUser = searchParams.get('user')

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