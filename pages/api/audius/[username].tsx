import { NextRequest, NextResponse } from 'next/server'
import internal from 'stream'

export const config = {
    runtime: 'experimental-edge',
  }

export interface User {
    name: string,
    handle: string,
    is_verified: boolean,
    followee_count: number,
    following_count: number
}

export default async function handle(req: NextRequest) {
    // get username from path
    const { pathname } = new URL(req.url)
    const [, username] = pathname.match(/^\/api\/gh\/([^\/]+)/) || []
    console.log(username)

    const headers = {
        'Accept':'application/json'
      };

    // hit Audius API
    const res = await fetch(`https://audius-discovery-9.cultur3stake.com/v1/users/9l9bo`, {
        method: 'GET',
        headers: headers
    })

    if (res.status === 200) {
        const user = await res.json()
        console.log(user)
        return NextResponse.json(
            {
                name: user.data.name,
                followee_count: user.data.followee_count
            }
        )
    }
}