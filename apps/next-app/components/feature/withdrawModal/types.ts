export interface WithdrawModalProps {
  open: boolean;
  setOpen: (item: boolean) => void;
  setOpenChild: (item: boolean) => void;
  bunkNumber: number;
}
