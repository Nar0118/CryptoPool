import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
} from 'react-share';
import Icon from 'components/shared/icon';
import WhiteBox from 'components/shared/whiteBox';
import Button from 'components/shared/button';
import Notification from 'components/shared/notification';
import { imagesSvg } from 'utils/constants/imagesSrc';

import styles from './sharedLink.module.scss';

export default function SharedLink(): JSX.Element {
  const shareLink = 'random-mail@gmail.com';

  return (
    <div>
      <WhiteBox style={styles.whiteBox}>
        <div className={styles.container}>
          <span className={styles.header}>
            <h1 className={styles.title}>ShareLink</h1>
            <span className={styles.divider}></span>
          </span>
          <div className={styles.iconBox}>
            <FacebookShareButton url={shareLink}>
              <span className={styles.icon}>
                <Icon width={50} height={50} src={imagesSvg.facebook} />
                <p className={styles.iconText}>Facebook</p>
              </span>
            </FacebookShareButton>
            <TelegramShareButton url={shareLink}>
              <span className={styles.icon}>
                <Icon width={50} height={50} src={imagesSvg.telegram} />
                <p className={styles.iconText}>Telegram</p>
              </span>
            </TelegramShareButton>
            <TwitterShareButton url={shareLink}>
              <span className={styles.icon}>
                <Icon width={50} height={50} src={imagesSvg.twitter} />
                <p className={styles.iconText}>Twitter</p>
              </span>
            </TwitterShareButton>
            <WhatsappShareButton url={shareLink}>
              <span className={styles.icon}>
                <Icon width={50} height={50} src={imagesSvg.whatsapp} />
                <p className={styles.iconText}>Whatsapp</p>
              </span>
            </WhatsappShareButton>
          </div>
          <p className={styles.label}>link</p>
          <div className={styles.linkBox}>
            <div className={styles.link}>
              <p>{shareLink}</p>
            </div>
            <Button
              className={styles.button}
              img={imagesSvg.copy}
              text="Copy"
              onClick={() => Notification('Link is copied to clipboard')}
            />
          </div>
        </div>
      </WhiteBox>
    </div>
  );
}
