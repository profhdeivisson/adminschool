const { UserRoles } = require('../constants/enums');

/**
 * Estratégia de autorização para seguir o princípio Open/Closed
 * Permite adicionar novos roles sem modificar código existente
 */
class AuthorizationStrategy {
  constructor() {
    this.strategies = new Map();
    this.initializeStrategies();
  }

  initializeStrategies() {
    // Estratégia para ADMIN - pode ver todos os usuários
    this.strategies.set(UserRoles.ADMIN, (users) => users);

    // Estratégia para PROFESSOR - pode ver apenas alunos
    this.strategies.set(UserRoles.PROFESSOR, (users) => 
      users.filter(user => user.role === UserRoles.ALUNO)
    );

    // Estratégia para ALUNO - não pode ver outros usuários
    this.strategies.set(UserRoles.ALUNO, () => {
      throw new Error('Acesso não autorizado');
    });
  }

  addStrategy(role, strategy) {
    this.strategies.set(role, strategy);
  }

  executeStrategy(role, users) {
    const strategy = this.strategies.get(role);
    if (!strategy) {
      throw new Error(`Estratégia não encontrada para o role: ${role}`);
    }
    return strategy(users);
  }

  canAccessUser(requestingUser, targetUser) {
    // ADMIN pode acessar qualquer usuário
    if (requestingUser.role === UserRoles.ADMIN) {
      return true;
    }

    // PROFESSOR pode acessar apenas alunos
    if (requestingUser.role === UserRoles.PROFESSOR && targetUser.role === UserRoles.ALUNO) {
      return true;
    }

    // Usuário pode acessar seu próprio perfil
    if (requestingUser.id === targetUser.id) {
      return true;
    }

    return false;
  }

  canDeleteUser(requestingUser, targetUser) {
    // Apenas ADMIN pode deletar usuários
    if (requestingUser.role !== UserRoles.ADMIN) {
      return false;
    }

    // Não pode deletar outro ADMIN
    if (targetUser.role === UserRoles.ADMIN) {
      return false;
    }

    // Não pode deletar a si mesmo
    if (requestingUser.id === targetUser.id) {
      return false;
    }

    return true;
  }

  canUpdateUser(requestingUser, targetUser) {
    // ADMIN pode atualizar qualquer usuário
    if (requestingUser.role === UserRoles.ADMIN) {
      return true;
    }

    // Usuário pode atualizar seu próprio perfil
    if (requestingUser.id === targetUser.id) {
      return true;
    }

    return false;
  }
}

module.exports = AuthorizationStrategy; 