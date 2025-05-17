export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateSignupForm(formData, validateEmailFn) {
  const newErrors = {};
  
  if (!formData.nome.trim()) {
    newErrors.nome = 'Nome é obrigatório';
  }
  
  if (!formData.email) {
    newErrors.email = 'Email é obrigatório';
  } else if (!validateEmailFn(formData.email)) {
    newErrors.email = 'Email inválido';
  }

  if (!formData.userType) {
    newErrors.userType = 'Selecione um tipo de usuário';
  }
  
  if (!formData.senha) {
    newErrors.senha = 'Senha é obrigatória';
  } else if (formData.senha.length < 8) {
    newErrors.senha = 'A senha deve ter pelo menos 8 caracteres';
  }
  
  if (!formData.confirmarSenha) {
    newErrors.confirmarSenha = 'Confirme sua senha';
  } else if (formData.senha !== formData.confirmarSenha) {
    newErrors.confirmarSenha = 'As senhas não correspondem';
  }
  
  return {
    isValid: Object.keys(newErrors).length === 0,
    newErrors
  };
}

export function validateLoginForm(formData) {
  const newErrors = {};
  
  if (!formData.email.trim()) {
    newErrors.email = 'Email é obrigatório';
  } else if (!validateEmail(formData.email)) {
    newErrors.email = 'Email inválido';
  }
  
  if (!formData.password) {
    newErrors.password = 'Senha é obrigatória';
  }
  
  return {
    isValid: Object.keys(newErrors).length === 0,
    newErrors
  };
}