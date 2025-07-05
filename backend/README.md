# AdminSchool Backend

Backend da aplicação AdminSchool construído com Node.js, Express e Supabase.

## 🚀 Configuração

### Pré-requisitos

- Node.js (versão 16 ou superior)
- Conta no Supabase
- NPM ou Yarn

### Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp env.example .env
```

4. Edite o arquivo `.env` com suas credenciais do Supabase:
```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
JWT_SECRET=seu_jwt_secret
PORT=3000
NODE_ENV=development
```

### Como obter as credenciais do Supabase

1. Acesse o [dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** > **API**
4. Copie:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

## 📊 Endpoints

### Health Check
- `GET /health` - Verifica o status do servidor e conexão com banco

### Usuários
- `POST /users/register` - Cadastrar novo usuário
- `POST /users/login` - Autenticar usuário
- `GET /users` - Listar usuários (requer autenticação)
- `GET /users/:id` - Buscar usuário por ID
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Excluir usuário

## 🔐 Segurança

### Service Role Key
O projeto utiliza duas instâncias do Supabase:
- **Cliente público**: Para operações que não requerem privilégios elevados
- **Cliente admin**: Para operações administrativas usando o service role key

### Variáveis de Ambiente
- `SUPABASE_SERVICE_ROLE_KEY`: Chave com privilégios elevados para operações administrativas
- `JWT_SECRET`: Chave secreta para assinatura de tokens JWT
- `NODE_ENV`: Ambiente de execução (development/production)

## 🏗️ Estrutura do Projeto

```
src/
├── config/
│   ├── supabase.js      # Configuração do Supabase
│   └── database.js      # Configuração centralizada do banco
├── controllers/
│   └── UserController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   └── User.js
├── repositories/
│   └── UserRepository.js
├── routes/
│   └── userRoutes.js
├── services/
│   └── UserService.js
└── app.js
```

## 🔧 Melhorias Implementadas

1. **Configuração Correta do Supabase**: Separação entre cliente público e admin
2. **Verificação de Conexão**: Teste automático de conectividade na inicialização
3. **Health Check**: Endpoint para monitoramento do sistema
4. **Tratamento de Erros**: Middleware centralizado para tratamento de erros
5. **Documentação**: README completo com instruções de configuração

## ⚠️ Importante

- **NUNCA** commite o arquivo `.env` no repositório
- Mantenha o `SUPABASE_SERVICE_ROLE_KEY` seguro e não a exponha publicamente
- Use diferentes chaves para diferentes ambientes (dev, staging, prod) 