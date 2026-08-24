import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://cwxfkkkhcavwkqxecehz.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_AkEVjmhrNXKiYfdPlsEqCQ_7JASPYup'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)