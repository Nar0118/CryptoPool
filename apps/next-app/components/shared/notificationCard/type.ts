export interface NotificationCardProps {
  setOpen?: (arg: boolean) => void;
  title: string;
  message: string;
  cardType: string;
  isModal?: boolean;
  onClose?: () => void;
}
