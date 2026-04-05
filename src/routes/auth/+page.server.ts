import { redirect } from '@sveltejs/kit'
import { env } from '$env/dynamic/public'
import type { PageServerLoad } from './$types'
import { signToken } from '$lib/server/crypto'

export const load: PageServerLoad = ({ url, cookies }) => {
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state') || '/'

  if (code === null) {
    const url = new URL(env.PUBLIC_OAUTH_START)
    url.searchParams.set('state', state)

    redirect(303, url)
  }

  cookies.set('SESSION_TOKEN', signToken(), {
    path: '/',
    secure: url.protocol === 'https:',
    httpOnly: true,
    sameSite: true
  })
  redirect(303, state)
}
