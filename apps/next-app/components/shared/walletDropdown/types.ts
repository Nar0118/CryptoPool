import { WalletMenuItemType } from "./type";

export interface WalletDropdownProps {
  walletMenu: WalletMenuItemType[];
  changeVisible: () => void
}
