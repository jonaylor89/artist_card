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
    return new Response(`No url defined`, {
      status: 500,
    });
  }

  const { searchParams } = new URL(req.url)
  const username = searchParams.get('username')
  // const dark = searchParams.has('dark')
  // const removeLink = searchParams.has('removeLink')
  // const noBorder = searchParams.has('noBorder')

  if (!username) {
    return new Response(`No username defined`, {
      status: 401,
    });
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
    return new Response('error generating the image', {
      status: 500
    })
  }

}
