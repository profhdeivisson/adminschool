const UserService = require('../services/UserService');
const UserRepository = require('../repositories/UserRepository');
const AuthorizationStrategy = require('../services/AuthorizationStrategy');

/**
 * Factory para criação de serviços com injeção de dependência
 * Facilita testes e mantém baixo acoplamento
 */
class ServiceFactory {
  static createUserService(repository = null, authorizationStrategy = null) {
    const userRepository = repository || new UserRepository();
    const authStrategy = authorizationStrategy || new AuthorizationStrategy();
    
    return new UserService(userRepository, authStrategy);
  }

  static createUserRepository() {
    return new UserRepository();
  }

  static createAuthorizationStrategy() {
    return new AuthorizationStrategy();
  }
}

module.exports = ServiceFactory; 