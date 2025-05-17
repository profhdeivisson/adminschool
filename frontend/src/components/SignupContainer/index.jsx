import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  CircularProgress
} from '@mui/material';
import AlertMessage from '../AlertMessage';
import './styles.css';
import { validateEmail, validateSignupForm } from '../../utils/validators';
import { useAlert } from '../../context/AlertContext';
import { useMessage } from '../../context/MessageContext';
import { useLoader } from '../../context/LoaderContext';

export default function SignupContainer({ onSignup }) {
  const {showLoader, hideLoader} = useLoader();
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  useEffect(() => {
    showLoader();
    const timer = setTimeout(() => {
      hideLoader();
    }, 1000);
    return () => {
      clearTimeout(timer);
      hideLoader();
    };
  }, []);

  const validateForm = () => {
    const { isValid, newErrors } = validateSignupForm(formData, validateEmail);
    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    const isValid = formData.nome.trim() !== '' && 
                    validateEmail(formData.email) && 
                    formData.userType !== '' && 
                    formData.senha.length >= 8 && 
                    formData.senha === formData.confirmarSenha;
    
    setIsFormValid(isValid);
  }, [formData]);

  const { showAlert } = useAlert();
  const { showMessage } = useMessage();
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setAlertMessage('Cadastro realizado com sucesso!');
        setAlertSeverity('success');
        setOpenAlert(true);

        if (onSignup) {
          onSignup(formData);
        }
        setTimeout(() => {
          showMessage('Cadastro realizado! Faça login');
          navigate('/');
        }, 1200);
      }, 1500);
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
            disabled={loading}
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
            disabled={loading}
          />
          
          <FormControl fullWidth error={!!errors.userType} required disabled={loading}>
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
            disabled={loading}
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
            disabled={loading}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            className="signup-button"
            disabled={!isFormValid || loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Cadastrar"}
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