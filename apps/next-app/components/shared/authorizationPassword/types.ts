export interface AuthorizationPasswordProps {
  pageType?: PageType;
}

export enum PageType {
  RESET_PASSWORD = 'resetPassword',
  CHECK_EMAIL = 'checkEmail',
}
