export interface MenuItemType {
  title: string;
  icon: string;
  redirectLink: string
}

export interface MenuType {
  menu: MenuItemType[];
  changeVisible: () => void
}
