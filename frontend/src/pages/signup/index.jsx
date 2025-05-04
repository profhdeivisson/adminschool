import SignupContainer from '../../components/SignupContainer';

export default function Signup() {
  const handleSignup = (userData) => {
    console.log('Usuário cadastrado:', userData);
  };

  return (
    <SignupContainer onSignup={handleSignup} />
  );
}