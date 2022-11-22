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

const APP_NAME = 'artist_card'

export default async function handler(req: NextRequest) {
    // get username from path
    const { searchParams } = new URL(req.url)
    const hasUsername = searchParams.has('username')

    const username = hasUsername
        ? (searchParams.get('username') || 'jonaylor89')
        : 'jonaylor89';

    const headers = {
        'Accept': 'application/json'
    };

    // hit Audius API
    // hit Audius API
    const sample = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
    const host = await fetch('https://api.audius.co')
      .then(r => r.json())
      .then(j => j.data)
      .then(d => sample(d))

    const res = await fetch(`${host}/users?handle=${username}`, {
        method: 'GET',
        headers: headers
    })

    if (res.status === 200) {
        const user = (await res.json()).data[0]
        const creatorNode = user.creator_node_endpoint.split(",")[0]
        const picSizes = user.profile_picture_sizes
        const avatarURL = `${creatorNode}/content/${picSizes}/480x480.jpg`
        
        //console.log(user.data[0])
        return NextResponse.json(
            {
                name: user.name,
                handle: user.handle,
                location: user.location,
                followee_count: user.followee_count,
                follower_count: user.follower_count,
                profile_picture: user.profile_picture,
                avatar_url: avatarURL
            }
        )
    }
}