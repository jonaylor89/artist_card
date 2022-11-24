interface Props {
  username?: string
}

export default function SeoHeaders({ username }: Props) {
  const title = pageTitle(username)
  const description =
    'Generate your custom image from your Audius username. A fun experiment of image generation.'
  const author = 'Johannes Naylor'
  const twitterAuthor = 'jonaylor89'
  const twitterSite = 'jonaylor89'
  const url = process.env.NEXT_PUBLIC_BASE_URL
  const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/i?username=${username || 'jonaylor89'
    }&noBorder`
  return (
    <>
      <title>{title}</title>
      {url && <link rel="canonical" href={url} />}
      <meta name="description" content={description} />
      <meta name="author" content={author} />
      <meta name="robots" content="index,follow" />
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={imageUrl} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:author" content={twitterAuthor} />
      <meta name="twitter:site" content={twitterSite} />
      {url && <meta name="twitter:url" content={url} />}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:description" content={description} />
    </>
  )
}

function pageTitle(username: any): string {
  return `${username ? `${username} · ` : ''}Artist Business Card`
}
