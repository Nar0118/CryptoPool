import { createContext, useContext } from 'react';
import { CurrentModal } from './provider';

export interface ModalContextInterface {
  modal: number;
  hide: boolean;
  setModal: (value: CurrentModal) => void;
}

export const ModalContext = createContext<ModalContextInterface>(
  {} as ModalContextInterface
);

export const useModalContext = () => useContext(ModalContext);
