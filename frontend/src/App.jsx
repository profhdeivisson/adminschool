import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Alert, 
  Snackbar 
} from '@mui/material';

export default function App() {
  const [formData, setFormData] = useState({
    nome: '',
    senha: ''
  });
  
  const [errors, setErrors] = useState({});
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('error');

  // Check for redirect message when component mounts
  useEffect(() => {
    const redirectMessage = localStorage.getItem('authRedirectMessage');
    if (redirectMessage) {
      // Set a small delay to ensure the page has loaded
      setTimeout(() => {
        setAlertMessage(redirectMessage);
        setAlertSeverity('error');
        setOpenAlert(true);
        // Clear the message so it doesn't show again on refresh
        localStorage.removeItem('authRedirectMessage');
      }, 500);
    }
  }, []);

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
      // Form is valid, proceed with login
      console.log('Login successful', formData);
      
      // Set authentication status
      localStorage.setItem('isAuthenticated', 'true');
      
      // Redirect to admin page if user is admin
      if (formData.nome.toLowerCase() === 'admin') {
        window.location.href = '/admin';
      } else {
        setAlertMessage('Login realizado com sucesso!');
        setAlertSeverity('success');
        setOpenAlert(true);
      }
    } else {
      // Form has errors
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
      
      <Snackbar 
        open={openAlert} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}