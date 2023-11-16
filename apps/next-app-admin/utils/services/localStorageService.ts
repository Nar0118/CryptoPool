export const getItemFromLocalStorage = (
  key: string,
  isJson: boolean = false
): JSON | string => {
  if (typeof window !== 'undefined') {
    const storageItem: string | null = localStorage.getItem(key);
    if (storageItem === null) return '';
    return isJson ? JSON.parse(storageItem) : storageItem;
  }
};

export const setItemInLocalStorage = (
  key: string,
  item: any,
  isStringify: boolean = false
): void => {
  if (typeof window !== 'undefined') {
    const entry = isStringify ? JSON.stringify(item) : item;
    localStorage.setItem(key, entry);
  }
};

export const removeItemFromLocalStorage = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

export const clearLocalStorage = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.clear();
  }
};
