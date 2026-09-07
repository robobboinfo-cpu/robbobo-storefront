const USERS_KEY = 'robbobo_local_users'
const SESSION_KEY = 'robbobo_local_session'

const resolveStorage = (storage) => {
  if (storage) return storage
  if (typeof window !== 'undefined') return window.localStorage
  return null
}

const parseSafe = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const normalizeEmail = (email) => String(email || '').trim().toLowerCase()

export const loadLocalUsers = (storage) => {
  const target = resolveStorage(storage)
  if (!target) return []
  return parseSafe(target.getItem(USERS_KEY), [])
}

const saveLocalUsers = (users, storage) => {
  const target = resolveStorage(storage)
  if (!target) return users
  target.setItem(USERS_KEY, JSON.stringify(users))
  return users
}

export const getLocalSessionUser = (storage) => {
  const target = resolveStorage(storage)
  if (!target) return null
  return parseSafe(target.getItem(SESSION_KEY), null)
}

export const setLocalSessionUser = (user, storage) => {
  const target = resolveStorage(storage)
  if (!target) return user
  target.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

export const clearLocalSessionUser = (storage) => {
  const target = resolveStorage(storage)
  if (!target) return
  target.removeItem(SESSION_KEY)
}

const stripPassword = (user) => {
  if (!user) return null
  const { password, ...safeUser } = user
  return safeUser
}

export const registerLocalAuth = ({ name, email, password, storage }) => {
  const users = loadLocalUsers(storage)
  const normalizedEmail = normalizeEmail(email)

  if (!normalizedEmail || !password) {
    return { success: false, message: 'Email and password are required.' }
  }

  if (users.some((user) => normalizeEmail(user.email) === normalizedEmail)) {
    return { success: false, message: 'An account with this email already exists.' }
  }

  const newUser = {
    id: `local-${Date.now()}`,
    email: normalizedEmail,
    password,
    user_metadata: { full_name: name, role: 'customer', local_fallback: true },
    app_metadata: { provider: 'email', providers: ['email'] },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    confirmed_at: new Date().toISOString(),
  }

  saveLocalUsers([newUser, ...users], storage)
  const safeUser = stripPassword(newUser)
  setLocalSessionUser(safeUser, storage)

  return { success: true, user: safeUser, localFallback: true }
}

export const signInLocalAuth = ({ email, password, storage }) => {
  const users = loadLocalUsers(storage)
  const normalizedEmail = normalizeEmail(email)
  const match = users.find((user) => normalizeEmail(user.email) === normalizedEmail && user.password === password)

  if (!match) {
    return { success: false, message: 'Invalid email or password.' }
  }

  const safeUser = stripPassword(match)
  setLocalSessionUser(safeUser, storage)
  return { success: true, user: safeUser, localFallback: true }
}
