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
    const res = await fetch(`https://discoveryprovider3.audius.co/users?handle=thomasl04&?app_name=${APP_NAME}`, {
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