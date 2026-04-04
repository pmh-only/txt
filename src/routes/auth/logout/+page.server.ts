import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
  default: async ({ url, cookies }) => {
    const state = url.searchParams.get('state') || '/'

    cookies.delete('SESSION_TOKEN', { path: '/' })
    redirect(303, state)
  }
}
