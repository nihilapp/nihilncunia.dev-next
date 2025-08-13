import { UserDao } from './dao/user.dao';
import type { UserDaoType } from './dao/user.dao.interface';
import { UserService } from './service/user.service.impl';
import type { UserServiceType } from './service/user.service.interface';

export class UserFactory {
  private static userDao: UserDaoType | null = null;
  private static userService: UserServiceType | null = null;

  static getUserDao(): UserDaoType {
    if (!this.userDao) {
      this.userDao = new UserDao();
    }
    return this.userDao;
  }

  static getUserService(): UserServiceType {
    if (!this.userService) {
      const userDao = this.getUserDao();
      this.userService = new UserService(userDao);
    }
    return this.userService;
  }
}
