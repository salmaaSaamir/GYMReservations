export class User {
  Id: number = 0;
  Password: string = '';
  FName: string = '';
  LName: string = '';
  Email: string = '';
  ImageUrl: string = '';
  UserMenus?: UserMenus[] = [];
  RememberMe?: boolean = false; // Optional because it’s [NotMapped] in backend
}

export class UserMenus {
  Id: number = 0;
  UserId: number = 0;
  MenuId: number = 0;
  Menu: SystemMenu = new SystemMenu();
}


export class SystemMenu {
  id: number = 0;
  displayName: string = '';
  iconName: string = '';
  route: string = '';
}
