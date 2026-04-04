import { validateToken } from '$lib/server/crypto'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ cookies }) => {
  const token = cookies.get('SESSION_TOKEN') ?? ''

  return {
    isAdmin: validateToken(token)
  }
}
