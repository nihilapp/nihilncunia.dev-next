import type { UserServiceType } from './service/user.service.interface';
import { UserFactory } from './user.factory';

const userServiceInstance = UserFactory.getUserService();

/**
 * User 도메인의 통합 서비스 객체
 * Factory 패턴을 통해 의존성 주입된 Service 인스턴스 사용
 * 사용자 엔티티 관련 모든 비즈니스 로직을 담당 (조회, 생성, 업데이트)
 *
 * 타입 안전성을 보장하기 위해 화살표 함수로 메서드를 래핑
 */
export const userService: UserServiceType = {
  // 사용자 조회 관련 메서드들
  getUserById: (id: string) => userServiceInstance.getUserById(id),
  getUserByEmail: (email: string) => userServiceInstance.getUserByEmail(email),
  getUserByEmailWithPassword: (email: string) => userServiceInstance.getUserByEmailWithPassword(email),
  getUserByIdWithPassword: (id: string) => userServiceInstance.getUserByIdWithPassword(id),

  // 사용자 생성 관련 메서드들
  createUser: (signUpData) => userServiceInstance.createUser(signUpData),
  createAdminUser: (signUpData) => userServiceInstance.createAdminUser(signUpData),

  // 사용자 정보 업데이트 관련 메서드들
  changePassword: (userId, changePasswordData) =>
    userServiceInstance.changePassword(userId, changePasswordData),
  updateRefreshToken: (userId, refreshToken) =>
    userServiceInstance.updateRefreshToken(userId, refreshToken),
  updatePassword: (userId, hashedPassword) =>
    userServiceInstance.updatePassword(userId, hashedPassword),
};
