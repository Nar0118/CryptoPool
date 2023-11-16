import moment from 'moment';
import { Moment } from 'moment';

const dateFormat: string = 'YYYY-MM-DD';

export const acceptWarningModal = (
  setWarningModalVisibility: () => void,
  setModalVisibility: () => void
): void => {
  setWarningModalVisibility();
  const myTimeout = setTimeout(() => {
    setModalVisibility();
    clearTimeout(myTimeout);
  }, 100);
};

export const handelCancel = (
  defaultValue: object,
  selectedValue: object,
  UpdateModalVisibility: () => void,
  WarningModalVisibility: () => void
): void => {
  const formChanged =
    JSON.stringify(defaultValue) === JSON.stringify(selectedValue);
  formChanged ? UpdateModalVisibility() : WarningModalVisibility();
};

export const disabledCreateStartDate = (current: Moment): boolean => {
  const customDate: Moment = moment(new Date(), dateFormat);

  return current && current <= moment(customDate, dateFormat);
};

export const formatDate = (date: string): string => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
};
