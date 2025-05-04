import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText
} from '@mui/material';
import AlertMessage from '../AlertMessage';
import './styles.css';

export default function SignupContainer({ onSignup }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    userType: '',
    senha: '',
    confirmarSenha: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('error');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const isValid = formData.nome.trim() !== '' && 
                    validateEmail(formData.email) && 
                    formData.userType !== '' && 
                    formData.senha.length >= 8 && 
                    formData.senha === formData.confirmarSenha;
    
    setIsFormValid(isValid);
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setAlertMessage('Cadastro realizado com sucesso!');
      setAlertSeverity('success');
      setOpenAlert(true);
      
      if (onSignup) {
        onSignup(formData);
      }
    } else {
      setAlertMessage('Por favor, corrija os erros no formulário.');
      setAlertSeverity('error');
      setOpenAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <>
      <div className="signup-container">
        <h1>CADASTRO</h1>
        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Nome"
            variant="outlined"
            fullWidth
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            error={!!errors.nome}
            helperText={errors.nome}
            required
          />
          
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
          
          <FormControl fullWidth error={!!errors.userType} required>
            <InputLabel id="userType-label">Tipo de Usuário</InputLabel>
            <Select
              labelId="userType-label"
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              label="Tipo de Usuário"
            >
              <MenuItem value="">Selecione um tipo</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="professor">Professor</MenuItem>
              <MenuItem value="aluno">Aluno</MenuItem>
            </Select>
            {errors.userType && <FormHelperText>{errors.userType}</FormHelperText>}
          </FormControl>
          
          <TextField
            label="Senha"
            variant="outlined"
            fullWidth
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            error={!!errors.senha}
            helperText={errors.senha}
            required
          />
          
          <TextField
            label="Confirmar Senha"
            variant="outlined"
            fullWidth
            type="password"
            id="confirmarSenha"
            name="confirmarSenha"
            value={formData.confirmarSenha}
            onChange={handleChange}
            error={!!errors.confirmarSenha}
            helperText={errors.confirmarSenha}
            required
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            className="signup-button"
            disabled={!isFormValid}
          >
            Cadastrar
          </Button>
        </form>
        <p className="login-link">
          Já possui conta? <Link to="/">Faça login</Link>
        </p>
      </div>
      
      <AlertMessage
        open={openAlert}
        message={alertMessage}
        severity={alertSeverity}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />
    </>
  );
}