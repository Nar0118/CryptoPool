export interface WarningModalProps {
  onCancel: () => void;
  onAccept: () => void;
  visible: boolean;
  messageTitle: string;
}
