import { useRouter } from 'next/router';
import Icon from 'components/shared/icon';
import { NavItemProps } from '../types';

import styles from './navitem.module.scss';

export default function NavItem({
  text,
  icon,
  active = false,
  href,
  activeIcon,
}: NavItemProps) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(href);
  };

  return (
    <div
      className={`${styles.navItem} ${active ? styles.activeItem : ''}`}
      onClick={handleNavigate}
    >
      <Icon src={active ? activeIcon : icon} width={20} height={20} />
      <span>{text}</span>
    </div>
  );
}
