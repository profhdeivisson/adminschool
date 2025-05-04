import { useEffect, useState } from 'react';
import LoginContainer from './components/LoginContainer';
import AlertMessage from './components/AlertMessage';

export default function App() {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('error');

  useEffect(() => {
    const redirectMessage = localStorage.getItem('authRedirectMessage');
    if (redirectMessage) {
      setTimeout(() => {
        setAlertMessage(redirectMessage);
        setAlertSeverity('error');
        setOpenAlert(true);
        localStorage.removeItem('authRedirectMessage');
      }, 500);
    }
  }, []);

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleLogin = (userData) => {
    console.log('User logged in:', userData);
  };

  return (
    <>
      <LoginContainer onLogin={handleLogin} />
      
      <AlertMessage
        open={openAlert}
        message={alertMessage}
        severity={alertSeverity}
        onClose={handleCloseAlert}
      />
    </>
  );
}