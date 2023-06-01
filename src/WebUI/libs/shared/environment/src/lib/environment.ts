import { supabaseConf } from './supabase'

export const environment = {
	production: false,
	...supabaseConf,
}
