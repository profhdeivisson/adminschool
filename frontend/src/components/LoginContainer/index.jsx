import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TextField, 
  Button,
} from '@mui/material';
import AlertMessage from '../AlertMessage';
import './styles.css';

export default function LoginContainer({ onLogin }) {
  const [formData, setFormData] = useState({
    nome: '',
    senha: ''
  });
  
  const [errors, setErrors] = useState({});
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('error');

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
    
    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Login successful', formData);
      
      localStorage.setItem('isAuthenticated', 'true');
      
      if (formData.nome.toLowerCase() === 'admin') {
        window.location.href = '/admin';
      } else {
        setAlertMessage('Login realizado com sucesso!');
        setAlertSeverity('success');
        setOpenAlert(true);
      }
      
      if (onLogin) {
        onLogin(formData);
      }
    } else {
      setAlertMessage('Por favor, preencha todos os campos.');
      setAlertSeverity('error');
      setOpenAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <>
      <div className="login-container">
        <h1>LOGIN</h1>
        <form className="login-form" onSubmit={handleSubmit} noValidate>
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
            margin="normal"
            required
          />
          
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
            margin="normal"
            required
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            className="login-button"
            sx={{ mt: 2 }}
          >
            Entrar
          </Button>
        </form>
        <p className="register-link">
          Não possui conta? <Link to="/signup">Cadastre-se</Link>
        </p>
      </div>
      
      <AlertMessage
        open={openAlert}
        message={alertMessage}
        severity={alertSeverity}
        onClose={handleCloseAlert}
      />
    </>
  );
}