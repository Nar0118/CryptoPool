import { useContext } from 'react';
import ProfileInfo from 'components/shared/profileInfo';
import InfoCard from 'components/feature/profileInfoCard';
import ProfileDetails from 'components/feature/profileDetails';
import HelpFeedback from 'components/feature/helpFeedback';
import InviteFriend from 'components/feature/inviteFriend';
import ContentLayout from 'components/feature/contentLayout';
import { AuthContext } from 'utils/context/auth/context';
import { imagesSvg } from 'utils/constants/imagesSrc';

import styles from './profile.module.scss';

export default function Profile(): JSX.Element {
  const { user } = useContext(AuthContext);

  return (
    <ContentLayout title="Good Evening" isClock={true}>
      <div className={styles.container}>
        <div className={styles.profileInfoSection}>
          <ProfileInfo fullName={user?.fullName} email={user?.email} />
        </div>
        <div className={styles.cardsSection}>
          <InfoCard
            iconSrc={imagesSvg.userCard}
            title="Profile Information"
            data={[
              {
                dataTitle: 'Username',
                dataInfo: user?.fullName,
              },
              {
                dataTitle: 'Email Id',
                dataInfo: user?.email,
              },
              {
                dataTitle: 'Password',
                dataInfo: '*****',
                isStrong: true,
              },
            ]}
          />
          <InfoCard
            iconSrc={imagesSvg.bankCard}
            title="Bank Account Details"
            data={[
              {
                dataTitle: 'Account Number',
                dataInfo: user?.bankAccount?.accountNumber,
              },
              {
                dataTitle: 'IFSC Code Or Swift Code',
                dataInfo: user?.bankAccount?.ifscOrSwiftCode,
              },
              {
                dataTitle: 'Card Number',
                dataInfo: user?.bankAccount?.cardNumber,
                isHidden: true,
                isStrong: false,
              },
            ]}
          />
          <ProfileDetails />
        </div>
        <div className={styles.footerPart}>
          <HelpFeedback />
          <InviteFriend />
        </div>
      </div>
    </ContentLayout>
  );
}
