import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qerbswpyzrqcwbfzxhrz.supabase.co'
const supabaseAnonKey = 'sb_publishable_182I8QQPb26ZWCGNplLHew__AiACqhh'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
