import { createClient } from '@supabase/supabase-js'

const DEFAULT_SUPABASE_URL = 'https://gaoajmtnbbalxtgcugzw.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_ot_CXWwebJyT-JN8ViQc0g_o3OkI_a_'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY

const isValidSupabaseUrl = (value) => {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname)
  } catch {
    return false
  }
}

export let supabaseConfigError = !supabaseUrl || !supabaseAnonKey
  ? 'Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  : !isValidSupabaseUrl(supabaseUrl)
    ? 'VITE_SUPABASE_URL must be a valid HTTP or HTTPS URL.'
    : ''

const createErrorResponse = () => ({ data: null, error: new Error(supabaseConfigError) })

const createQueryBuilder = () => {
  const response = createErrorResponse()
  const builder = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    eq: () => builder,
    order: () => builder,
    single: async () => response,
    maybeSingle: async () => response,
    then: (resolve, reject) => Promise.resolve(response).then(resolve, reject),
    catch: (reject) => Promise.resolve(response).catch(reject),
  }
  return builder
}

const createMockChannel = (name) => {
  const channel = {
    topic: name,
    on: () => channel,
    subscribe: () => channel,
    unsubscribe: async () => 'ok',
  }
  return channel
}

const createMockSupabase = () => ({
  auth: {
    getSession: async () => ({ data: { session: null }, error: new Error(supabaseConfigError) }),
    onAuthStateChange: (callback) => {
      callback?.('SIGNED_OUT', null)
      return { data: { subscription: { unsubscribe() {} } } }
    },
    signInWithPassword: async () => ({ data: null, error: new Error(supabaseConfigError) }),
    signUp: async () => ({ data: null, error: new Error(supabaseConfigError) }),
    signOut: async () => ({ error: null }),
  },
  from: () => createQueryBuilder(),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: new Error(supabaseConfigError) }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
  channel: (name) => createMockChannel(name),
  removeChannel: async (channel) => channel?.unsubscribe?.() ?? 'ok',
})

let supabaseClient

if (supabaseConfigError) {
  supabaseClient = createMockSupabase()
} else {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    supabaseConfigError = error?.message || 'Supabase could not be initialized.'
    supabaseClient = createMockSupabase()
  }
}

export const supabase = supabaseClient
