const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const databaseConfig = require('./config/database');
const environment = require('./config/environment');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbStats = await databaseConfig.getDatabaseStats();
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStats
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Routes
app.use('/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
          message: environment.isDevelopment() ? err.message : 'Algo deu errado'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    message: `A rota ${req.originalUrl} não existe`
  });
});

const PORT = environment.PORT;

// Inicialização do servidor com verificação de conexão
async function startServer() {
  try {
    // Testa conexão com o banco antes de iniciar o servidor
    const isConnected = await databaseConfig.testConnection();
    
    if (!isConnected) {
      console.error('❌ Falha na conexão com o banco de dados. Verifique suas variáveis de ambiente.');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 Health check disponível em: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error.message);
    process.exit(1);
  }
}

startServer();