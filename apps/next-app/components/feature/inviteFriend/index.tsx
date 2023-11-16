import Button from 'components/shared/button';
import Icon from 'components/shared/icon';
import Image from 'components/shared/image';
import { imagesPng, imagesSvg } from 'utils/constants/imagesSrc';

import styles from './invite.module.scss';

export default function InviteFriend(): JSX.Element {
  return (
    <div className={styles.container}>
      <Image src={imagesPng.inviteFriend} width={200} height={105} />
      <div className={styles.headerSection}>
        <Icon width={29} height={29} src={imagesSvg.supportIcon} />
        <span>Help & feedback</span>
      </div>
      <p className={styles.description}>
        Invite friends to add assets and get $600 worth of Bitcoin when your
        friends does their first payment. They get $50!
      </p>
      <Button className={styles.inviteButton} text="Invite" />
    </div>
  );
}
