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
const defaultAvatarUrl = 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1780&q=80'

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

    console.log('new request: ', JSON.stringify({
        username,
    }))

    // hit Audius API
    const sample = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
    const host = await fetch('https://api.audius.co')
        .then(r => r.json())
        .then(j => j.data)
        .then(d => sample(d))

    const url = `${host}/users?handle=${username}`
    console.log('audius request url', url)
    const res = await fetch(url, {
        method: 'GET',
        headers: headers
    })

    if (res.status !== 200) {
        return NextResponse.json({})
    }

    const json = await res.json()
    console.log('json res', json)
    if (json.data === undefined || json.data.length === 0) {
        return NextResponse.json({})
    }
    const user = json.data[0]

    if (user === undefined || user === null) {
        console.log('user is null')
        return NextResponse.json({})
    }

    const creatorNode = user.creator_node_endpoint?.split(",")[0]
    const picSizes = user.profile_picture_sizes
    const avatarURL = `${creatorNode}/content/${picSizes}/480x480.jpg`

    return NextResponse.json(
        {
            name: user.name || '',
            bio: user.bio || '',
            handle: user.handle || '',
            track_count: user.track_count || 0,
            location: user.location || '',
            followee_count: user.followee_count || 0,
            follower_count: user.follower_count || 0,
            avatar_url: avatarURL || defaultAvatarUrl,
            supporter_count: user.supporter_count || 0,
            supporting_count: user.supporting_count || 0,
            created_at: user.created_at || (new Date()).toISOString(),
            is_verified: user.is_verified || false
        }
    )
}
