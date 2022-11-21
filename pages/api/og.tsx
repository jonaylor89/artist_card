// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ImageResponse } from '@vercel/og'
import type { NextApiRequest } from 'next'

export const config = {
  runtime: 'experimental-edge',
}

const IMAGE_WIDTH = 1200
const IMAGE_HEIGHT = 628

export default function handler(
  req: NextApiRequest,
) {
  if (req.url === undefined) {
    return errorResponse('something went wrong')
  }

  const { searchParams } = new URL(req.url)
  const hasUsername = searchParams.has('username');
  const username = hasUsername
    ? searchParams.get('username')?.slice(0, 100)
    : 'jonaylor89';
  // const dark = searchParams.has('dark')
  // const removeLink = searchParams.has('removeLink')
  // const noBorder = searchParams.has('noBorder')

  if (username === '') {
    return errorResponse('username cannot be empty')
  }

  try {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 100,
            color: 'black',
            background: 'white',
            width: '100%',
            height: '100%',
            padding: '50px 200px',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'none',
          }}
        >
          Hey {username} 👋, 🌎
        </div>
      ),
      {
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        emoji: 'twemoji',
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