// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ImageResponse } from '@vercel/og'
import type { NextApiRequest } from 'next'

export const config = {
  runtime: 'experimental-edge',
}

const IMAGE_WIDTH = 1200
const IMAGE_HEIGHT = 628
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export default async function handler(
  req: NextApiRequest,
) {
  if (req.url === undefined) {
    return errorResponse('something went wrong')
  }

  const { searchParams } = new URL(req.url)
  const hasUsername = searchParams.has('username');
  const hasDark = searchParams.has('dark')
  const hasRemoveLink = searchParams.has('removeLink')
  const hasNoBorder = searchParams.has('noBorder')

  const username = hasUsername
    ? (searchParams.get('username') || 'jonaylor89')
    : 'jonaylor89';
  const dark = hasDark
    ? JSON.parse(searchParams.get('dark') || 'false')
    : false
  const removeLink = hasRemoveLink
    ? JSON.parse(searchParams.get('removeLink') || 'false')
    : false
  const noBorder = hasNoBorder
    ? JSON.parse(searchParams.get('noBorder') || 'false')
    : false

  if (username === '') {
    return errorResponse('username cannot be empty')
  }

  console.log('new image: ', JSON.stringify({
    username,
    dark,
    removeLink,
    noBorder,
  }))

  const fakeUser = {
    artistName: 'Johannes',
    handle: username,
    bio: 'da beep boops',
    trackCount: 15,
    followers: 5_000,
    supporters: 8,
    supporting: 8,
    created_at: "2021-08-19T14:03:15 Z",
    is_verified: false,
    location: "BCN",
    avatar_url: "https://creatornode2.audius.co/ipfs/QmUkJ9mZtdc63mneA31hoWRn3ZfazqSaXYE76Qc5ywCVSG/480x480.jpg",
  }

  const res = await fetch(`${baseUrl}/api/audius?username=${username}`)
  
  if (res.status !== 200) {
    return errorResponse('something went wrong with fetching audius data')
  } 

  const user = await res.json()

  try {
    return new ImageResponse(
      (
        <div tw={`flex w-full h-full items-stretch ${noBorder ? '' : 'p-8'}`}>
          <div
            tw={`${dark ? 'bg-slate-900 text-slate-200' : 'bg-white text-black'
              } ${noBorder ? 'p-8' : 'shadow-xl'
              } flex-1 items-stretch flex flex-col text-2xl`}
          >
            {!removeLink && (
              <div tw="flex h-16 -mb-16 self-end py-2 px-4">
                <span tw={`${dark ? `text-slate-500` : `text-slate-300`} mr-2`}>
                  Get your card at
                </span>{' '}
                <span tw={`${dark ? `text-slate-300` : `text-slate-500`}`}>
                  card.audius.co
                </span>
              </div>
            )}
            <div tw="flex items-center flex-1 border-4">
              <div tw="flex w-1/3 justify-end pb-12 mr-12">
                <div tw="flex flex-col items-center">
                  <img
                    src={user.avatar_url}
                    tw="w-64 h-64 rounded-full shadow-2xl mb-4"
                    style={{ objectPosition: 'center', objectFit: 'cover' }}
                  />
                  <div
                    tw={`text-xl ${dark ? 'text-slate-300' : 'text-slate-500'}`}
                  >{`Since ${new Date(user.created_at).toLocaleDateString(
                    'en-US',
                    {
                      month: 'long',
                      year: 'numeric',
                    }
                  )}`}</div>
                </div>
              </div>
              <div tw="flex w-2/3 flex-col pr-16">
                <div tw="text-6xl">{user.name}</div>
                <div
                  tw={`text-3xl mb-2 flex ${dark ? `text-slate-300` : `text-slate-400`
                    }`}
                >
                  <span tw={dark ? `text-slate-500` : `text-slate-400`}>
                    audius.co/
                  </span>
                  {user.handle}
                </div>
                {user.bio && (
                  <div tw="text-2xl">
                    {user.bio
                      .replace(
                        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
                        ''
                      )
                      .trim()}
                  </div>
                )}
                <div tw="flex mb-2 mt-8">
                  👥{' '}
                  {user.follower_count === 1
                    ? `${user.follower_count} follower`
                    : `${user.follower_count.toLocaleString('en-US')} followers`}{' '}
                </div>
                <div tw="flex flex-wrap">
                  {user.location && (
                    <div tw="flex mb-2 mr-4">📍 {user.location}</div>
                  )}
                </div>
              </div>
            </div>
            <div tw="flex flex-shrink-0 border -mt-24 justify-between p-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=84x84&bgcolor=${dark ? '0f172a' : 'fff'
                  }&color=${dark ? 'cbd5e1' : '64748b'
                  }&data=${`https://audius.co/${user.handle}`}`}
              />
            </div>
          </div>
        </div>
      ),
      {
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        headers: { 'cache-control': 'public, max-age=60' },
      }
    )
  } catch (e: any) {
    console.log(e)
    return errorResponse(e.message)
  }
}

function errorResponse(message: string): ImageResponse {
  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col p-4 items-center justify-center">
        <div tw="flex flex-col items-stretch rounded-xl shadow-2xl min-w-1/2">
          <div tw="text-3xl bg-red-600 text-white px-4 py-2 rounded-t-xl">
            Error
          </div>
          <div tw="text-xl border border-red-600 p-4 rounded-b-xl bg-white">
            {message}
          </div>
        </div>
      </div>
    ),
    { width: IMAGE_WIDTH, height: IMAGE_HEIGHT }
  )
}