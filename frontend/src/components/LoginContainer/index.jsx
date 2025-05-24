import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button,
  CircularProgress
} from '@mui/material';
import AlertMessage from '../AlertMessage';
import './styles.css';
import { validateLoginForm } from '../../utils/validators';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { useMessage } from '../../context/MessageContext';
import { useLoader } from '../../context/LoaderContext';
import { postLogin } from '../../services/login';

export default function LoginContainer({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('error');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { alert, clearAlert } = useAlert();
  const { message, clearMessage } = useMessage();
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const { isValid, newErrors } = validateLoginForm(formData);
    setErrors(newErrors);
    return isValid;
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

  if (alert && alert.message) {
    setAlertMessage(alert.message);
    setAlertSeverity(alert.severity || 'info');
    setOpenAlert(true);
    clearAlert();
  }

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setAlertMessage(message);
        setAlertSeverity('success');
        setOpenAlert(true);
        clearMessage();
      }, 500);
    }
  }, [message, clearMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await postLogin(formData);
        setLoading(false);

        if(response.error) {
          setAlertMessage(response.error);
          setAlertSeverity('error');
          setOpenAlert(true);
          return;
        }

        if(response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userType', response.data.user.role.toLowerCase());
          login(response.data.user);
        }

        navigate('/admin');
      } catch (error) {
        setLoading(false);
        setAlertMessage(error.data.error);
        setAlertSeverity('error');
        setOpenAlert(true);
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
            label="Email"
            variant="outlined"
            fullWidth
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            required
            disabled={loading}
          />
          
          <TextField
            label="Senha"
            variant="outlined"
            fullWidth
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            required
            disabled={loading}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            className="login-button"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
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