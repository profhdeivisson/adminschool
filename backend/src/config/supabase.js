const { createClient } = require('@supabase/supabase-js');
const environment = require('./environment');

const supabaseUrl = environment.SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = environment.SUPABASE_ANON_KEY || 'dummy-key';
const supabaseServiceRoleKey = environment.SUPABASE_SERVICE_ROLE_KEY || 'dummy-service-key';

// Verificar se as variáveis de ambiente estão configuradas
if (!environment.isSupabaseConfigured()) {
  console.warn('⚠️  Variáveis de ambiente do Supabase não configuradas. Usando valores dummy.');
}

// Cliente para operações públicas (com anon key)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente para operações administrativas (com service role key)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

module.exports = { supabase, supabaseAdmin };