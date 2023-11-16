import { warningModalContent } from 'utils/constants/fakeData';

export const notificationsData: Array<NotificationModel> = [
  {
    id: '1',
    title: warningModalContent.filedModalTitle,
    message: warningModalContent.filedModalMessage,
    cardType: warningModalContent.filedModalIcon,
  },
  {
    id: '2',
    title: warningModalContent.wrongModalTitle,
    message: warningModalContent.wrongModalMessage,
    cardType: warningModalContent.wrongModalIcon,
  },
  {
    id: '3',
    title: warningModalContent.acceptModalTitle,
    message: warningModalContent.acceptModalMessage,
    cardType: warningModalContent.acceptModalIcon,
  },
];

export interface NotificationModel {
  id: string;
  title: string;
  message: string;
  cardType: string;
}
