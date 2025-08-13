import { AuthFactory } from './auth.factory';
import type { AuthServiceType } from './service/auth.service.interface';

// Factory에서 생성된 AuthService 인스턴스 가져오기
const authServiceInstance = AuthFactory.getAuthService();

/**
 * Auth 도메인의 통합 서비스 객체
 * Factory 패턴을 통해 의존성 주입된 Service 인스턴스 사용
 * 순수한 인증 관련 비즈니스 로직만 담당 (로그인, 로그아웃, 세션 검증, 비밀번호 재설정, 관리자 인증)
 *
 * 타입 안전성을 보장하기 위해 화살표 함수로 메서드를 래핑
 */
export const authService: AuthServiceType = {
  // 사용자 인증 관련 기능들
  signIn: (signInData) => authServiceInstance.signIn(signInData),
  signOut: (userId) => authServiceInstance.signOut(userId),

  // 세션 검증 기능
  verifySession: (accessToken, refreshToken) =>
    authServiceInstance.verifySession(accessToken, refreshToken),

  // 비밀번호 재설정 기능들 (토큰 기반)
  requestPasswordReset: (email) => authServiceInstance.requestPasswordReset(email),
  resetPassword: (token, newPassword) => authServiceInstance.resetPassword(token, newPassword),

  // 관리자 인증 기능들
  createAdminVerification: (ipAddress) =>
    authServiceInstance.createAdminVerification(ipAddress),
  verifyAdminCode: (code) => authServiceInstance.verifyAdminCode(code),
};
