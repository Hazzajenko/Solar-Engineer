import { supabaseConf } from './supabase'

export const environment = {
	production: true,
	...supabaseConf,
}
