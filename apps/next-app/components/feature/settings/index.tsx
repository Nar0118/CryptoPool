import PageTitle from 'components/shared/pageTitle';
import PaymentSettings from 'components/shared/paymentSettings';
import ContentLayout from 'components/feature/contentLayout';

import styles from './settings.module.scss';

export default function Settings(): JSX.Element {
  return (
    <ContentLayout title="Good Evening" isClock={true}>
      <div className={styles.settings}>
        <PaymentSettings />
      </div>
    </ContentLayout>
  );
}
