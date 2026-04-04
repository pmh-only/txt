import { env } from '$env/dynamic/private'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'

export const validateToken = (token: string): boolean => {
  try {
    const payload = jwt.verify(token, env.TOKEN_SECRET)
    return payload.startsWith('txt:)')
  } catch {
    return false
  }
}

export const signToken = (): string => {
  return jwt.sign(`txt:)${crypto.randomUUID()}`, env.TOKEN_SECRET)
}
