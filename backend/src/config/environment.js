require('dotenv').config();

/**
 * Configuração centralizada de ambiente
 * Centraliza todas as variáveis de ambiente em um local
 */
const environment = {
  // Configurações do servidor
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Configurações do JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  
  // Configurações do Supabase
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  
  // Configurações de segurança
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 10,
  
  // Configurações de validação
  MIN_PASSWORD_LENGTH: parseInt(process.env.MIN_PASSWORD_LENGTH) || 8,
  
  // Verificações de ambiente
  isDevelopment: () => environment.NODE_ENV === 'development',
  isProduction: () => environment.NODE_ENV === 'production',
  isTest: () => environment.NODE_ENV === 'test',
  
  // Verificações de configuração
  isSupabaseConfigured: () => {
    return !!(environment.SUPABASE_URL && 
              environment.SUPABASE_ANON_KEY && 
              environment.SUPABASE_SERVICE_ROLE_KEY);
  }
};

module.exports = environment; 