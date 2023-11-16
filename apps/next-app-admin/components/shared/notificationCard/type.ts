export interface NotificationCardProps {
  setOpen?: (arg: boolean) => void;
  title: string;
  message: string;
  isModal?: boolean;
  onClose?: () => void;
}
