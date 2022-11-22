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

    // hit Audius API
    // hit Audius API
    const sample = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
    const host = await fetch('https://api.audius.co')
        .then(r => r.json())
        .then(j => j.data)
        .then(d => sample(d))

    const res = await fetch(`${host}/users?handle=${username}?app_name=${APP_NAME}`, {
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
                created_at: user.created_at || new Date().toISOString(),
                is_verified: user.is_verified || false
            }
        )
    }
}

/*
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
*/