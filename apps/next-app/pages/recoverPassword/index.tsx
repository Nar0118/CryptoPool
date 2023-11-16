import AuthBackground from 'components/shared/authLayout';
import RecoverPassword from 'components/feature/recoverPassword';

export default function RecoverPasswordPage(): JSX.Element {
  return (
    <AuthBackground>
      <RecoverPassword />
    </AuthBackground>
  );
}
