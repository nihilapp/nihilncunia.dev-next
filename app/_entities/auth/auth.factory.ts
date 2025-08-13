import { UserFactory } from '@/_entities/users/user.factory';

import { AuthDao } from './dao/auth.dao';
import type { AuthDaoType } from './dao/auth.dao.interface';
import { AuthService } from './service/auth.service.impl';
import type { AuthServiceType } from './service/auth.service.interface';

/**
 * Auth 도메인의 의존성 주입을 관리하는 Factory 클래스
 * Spring Boot의 @Service, @Repository 패턴을 TypeScript로 구현
 * Service와 DAO의 인스턴스를 생성하고 의존성을 주입하여 제공
 */
export class AuthFactory {
  private static authDao: AuthDaoType = new AuthDao();
  private static authService: AuthServiceType | null = null;

  /**
   * AuthService 인스턴스를 반환
   * AuthDao와 UserService 의존성이 주입된 Service 인스턴스 제공
   * @returns {AuthServiceType} 의존성이 주입된 AuthService 인스턴스
   */
  static getAuthService(): AuthServiceType {
    if (!this.authService) {
      const userService = UserFactory.getUserService();
      this.authService = new AuthService(this.authDao, userService);
    }
    return this.authService;
  }

  /**
   * AuthDao 인스턴스를 반환
   * 순수 데이터 접근 레이어 인스턴스 제공
   * @returns {AuthDaoType} AuthDao 인스턴스
   */
  static getAuthDao(): AuthDaoType {
    return this.authDao;
  }
}
