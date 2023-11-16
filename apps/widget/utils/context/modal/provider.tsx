import { ModalContext } from './context';
import { useState } from 'react';

interface ModalProviderProps {
  children: React.ReactNode;
}

export type CurrentModal = {
  index: number;
  hide: boolean;
};

export const ModalProvider = ({
  children,
}: ModalProviderProps): JSX.Element => {
  const [modal, setModal] = useState<CurrentModal>({ index: 1, hide: false });

  const values = {
    modal: modal.index,
    hide: modal.hide,
    setModal,
  };

  return (
    <ModalContext.Provider value={values}>{children}</ModalContext.Provider>
  );
};
