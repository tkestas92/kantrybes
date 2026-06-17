export function createToken(): string {
  const payload = { admin: true, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 }
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

export function verifyToken(token: string): boolean {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString())
    return payload.admin === true && payload.exp > Date.now()
  } catch {
    return false
  }
}
