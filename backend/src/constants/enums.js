const UserRoles = {
  ADMIN: 'ADMIN',
  PROFESSOR: 'PROFESSOR',
  ALUNO: 'ALUNO',
  
  isValid: (role) => Object.values(UserRoles).includes(role),
  values: () => Object.values(UserRoles)
};

module.exports = { UserRoles };