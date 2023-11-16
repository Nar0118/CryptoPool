export function validMail(mail: string): boolean {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    mail
  );
}

export const currentPath = (path: string): boolean => {
  switch (path) {
    case '/signup':
    case '/login':
    case '/resetPassword':
    case '/checkMail':
    case '/createNewPassword':
      return false;
    default:
      return true;
  }
};

export const abbreviateWalletAddress = (string: string): string => {
  return string.slice(0, 5) + '...' + string.slice(string.length - 4);
};
