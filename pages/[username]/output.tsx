
import styles from '../../styles.Home.module.css'
import CopyInput from './copy-input';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export default function Output({ username, dark, removeLink }:
    {
        username: string
        dark: boolean
        removeLink: boolean
    }) {

    return (
        <>
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