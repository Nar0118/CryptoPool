import AuthorizationPassword from 'components/shared/authorizationPassword';
import { PageType } from 'components/shared/authorizationPassword/types';

export default function ChangeEmail(): JSX.Element {
  return <AuthorizationPassword pageType={PageType.CHECK_EMAIL} />;
}
