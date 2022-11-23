
import { useState } from 'react';
import styles from '../styles/Home.module.css'
import CopyInput from './copy-input';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export default function Output({ username }:
    {
        username: string
    }) {
    const [dark, setDark] = useState(false)
    const [removeLink, setRemoveLink] = useState(false)

    return (
        <>
            <div className={styles.imageContainer}>
                <div className={styles.loadingText}>
                    Loading… (can take a few seconds)
                </div>
                <div className={styles.image}>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: htmlCodeForUserName(username, dark, removeLink),
                        }} />
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
                                Remove watermark link
                            </label>
                        </div>
                        <a
                            href={imageUrlForUsername(username, dark, removeLink)}
                            download={`${username}-audius-business-card.png`}
                            className={styles.downloadButton}
                        >
                            Download
                        </a>
                    </div>
                </div>




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
        </>
    );
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
