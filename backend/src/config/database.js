const { supabase, supabaseAdmin } = require('./supabase');
const environment = require('./environment');

class DatabaseConfig {
  constructor() {
    this.supabase = supabase;
    this.supabaseAdmin = supabaseAdmin;
  }

  // Método para verificar a conectividade com o Supabase
  async testConnection() {
    try {
      // Verificar se as variáveis de ambiente estão configuradas
      if (!environment.isSupabaseConfigured()) {
        console.warn('⚠️  Variáveis de ambiente do Supabase não configuradas. Servidor iniciará em modo de desenvolvimento.');
        return true; // Permite que o servidor inicie mesmo sem configuração completa
      }

      const { data, error } = await this.supabaseAdmin
        .from('users')
        .select('count')
        .limit(1);
      
      if (error) {
        console.warn('⚠️  Erro de conexão com Supabase:', error.message);
        return true; // Permite que o servidor inicie mesmo com erro de conexão
      }
      
      console.log('✅ Conexão com Supabase estabelecida com sucesso');
      return true;
    } catch (error) {
      console.warn('⚠️  Erro ao conectar com Supabase:', error.message);
      return true; // Permite que o servidor inicie mesmo com erro
    }
  }

  // Método para obter estatísticas do banco
  async getDatabaseStats() {
    try {
      // Verificar se as variáveis de ambiente estão configuradas
      if (!environment.isSupabaseConfigured()) {
        return {
          totalUsers: 0,
          database: 'Supabase',
          status: 'not_configured',
          message: 'Variáveis de ambiente não configuradas'
        };
      }

      const { count, error } = await this.supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        return {
          totalUsers: 0,
          database: 'Supabase',
          status: 'error',
          error: error.message
        };
      }
      
      return {
        totalUsers: count || 0,
        database: 'Supabase',
        status: 'connected'
      };
    } catch (error) {
      return {
        totalUsers: 0,
        database: 'Supabase',
        status: 'error',
        error: error.message
      };
    }
  }
}

module.exports = new DatabaseConfig(); 