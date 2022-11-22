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
    console.log(req)
    const [, username] = pathname.match(/^\/api\/gh\/([^\/]+)/) || []

    const headers = {
        'Accept':'application/json'
      };

    // hit Audius API
    const res = await fetch(`https://discoveryprovider3.audius.co/users?handle=thomasl04`, {
        method: 'GET',
        headers: headers
    })

    if (res.status === 200) {
        const user = await res.json()
        //console.log(user.data[0])
        return NextResponse.json(
            {
                name: user.data[0].name,
                handle: user.data[0].handle,
                location: user.data[0].location,
                followee_count: user.data[0].followee_count,
                follower_count: user.data[0].follower_count,
                profile_picture: user.data[0].profile_picture
            }
        )
    }
}