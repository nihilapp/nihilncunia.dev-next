export const commonErrorMessage = '처리중 오류가 발생했습니다.';

export const authMessage = {
  // 기본 인증 기능
  signinSuccess: '로그인 성공',
  signinError: '로그인 실패',
  signupSuccess: '회원가입 성공',
  signupError: '회원가입 실패',
  signoutSuccess: '로그아웃 성공',
  signoutError: '로그아웃 실패',

  // 관리자 회원가입
  adminSignupSuccess: '관리자 회원가입 성공',
  adminSignupError: '관리자 회원가입 실패',
  adminEmailNotConfigured: '관리자 이메일이 설정되지 않았습니다.',
  adminVerificationCodeSent: '인증 코드가 발송되었습니다.',
  adminVerificationCodeError: '인증 코드 생성에 실패했습니다.',
  adminVerificationSuccess: '인증에 성공했습니다.',
  adminVerificationError: '인증 코드 검증에 실패했습니다.',
  adminVerificationNotFound: '인증 요청 기록이 없습니다.',
  adminVerificationExpired: '인증 코드가 만료되었습니다.',
  adminVerificationMismatch: '인증 코드가 일치하지 않습니다.',

  // 비밀번호 재설정
  forgotPasswordSuccess: '비밀번호 찾기 이메일이 발송되었습니다.',
  forgotPasswordError: '비밀번호 찾기 실패',
  forgotPasswordEmailSent: '임시 비밀번호가 이메일로 발송되었습니다.',
  newPasswordSuccess: '비밀번호 변경 성공',
  newPasswordError: '비밀번호 변경 실패',
  resetPasswordSuccess: '비밀번호 재설정 성공',
  resetPasswordError: '비밀번호 재설정 실패',

  // 이메일 인증
  signupEmailVerifySuccess: '이메일 인증 성공',
  signupEmailVerifyError: '이메일 인증 실패',
  verifyEmailSuccess: '이메일 인증 성공',
  verifyEmailError: '이메일 인증 실패',

  // OTP 시스템
  otpSendSuccess: 'OTP 코드가 발송되었습니다.',
  otpSendError: 'OTP 발송 실패',
  otpVerifySuccess: 'OTP 인증 성공',
  otpVerifyError: 'OTP 인증 실패',

  // 세션 관리
  sessionExpired: '세션이 만료되었습니다. 다시 로그인해주세요.',
  sessionInvalid: '유효하지 않은 세션입니다.',
  sessionVerificationError: '세션 검증 중 오류가 발생했습니다.',
  tokenRefreshSuccess: '토큰이 갱신되었습니다.',

  // 보안 기능
  unauthorized: '인증이 필요합니다.',
  forbidden: '접근 권한이 없습니다.',
  invalidCredentials: '이메일 또는 비밀번호가 올바르지 않습니다.',
  accountLocked: '계정이 잠겼습니다.',
  accountInactive: '비활성화된 계정입니다.',

  // 계정 관리
  deleteAccountSuccess: '계정 삭제 성공',
  deleteAccountError: '계정 삭제 실패',
  accountDeactivated: '계정이 비활성화되었습니다.',
  accountActivated: '계정이 활성화되었습니다.',
};

export const userMessage = {
  // 사용자 조회
  getAllSuccess: '사용자 목록 조회 성공',
  getAllError: '사용자 목록 조회 실패',
  searchSuccess: '사용자 검색 성공',
  searchError: '사용자 검색 실패',
  getDetailSuccess: '사용자 조회 성공',
  getDetailError: '사용자 조회 실패',
  getProfileSuccess: '프로필 조회 성공',
  getProfileError: '프로필 조회 실패',

  // 사용자 생성/수정
  createSuccess: '사용자 생성 성공',
  createError: '사용자 생성 실패',
  updateSuccess: '사용자 정보 수정 성공',
  updateError: '사용자 정보 수정 실패',
  updateProfileSuccess: '프로필 수정 성공',
  updateProfileError: '프로필 수정 실패',

  // 비밀번호 관리
  updatePasswordSuccess: '비밀번호 수정 성공',
  updatePasswordError: '비밀번호 수정 실패',
  currentPasswordIncorrect: '현재 비밀번호가 올바르지 않습니다.',
  passwordMismatch: '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.',

  // 계정 상태 관리
  activateAccountSuccess: '계정 활성화 성공',
  activateAccountError: '계정 활성화 실패',
  deactivateAccountSuccess: '계정 비활성화 성공',
  deactivateAccountError: '계정 비활성화 실패',

  // 소셜 링크 관리
  updateSocialLinksSuccess: '소셜 링크 수정 성공',
  updateSocialLinksError: '소셜 링크 수정 실패',

  // 사용자 삭제
  deleteSuccess: '사용자 삭제 성공',
  deleteError: '사용자 삭제 실패',

  // 데이터 검증
  emailAlreadyExists: '이미 사용 중인 이메일입니다.',
  emailNotFound: '등록되지 않은 이메일입니다.',
  userNotFound: '사용자를 찾을 수 없습니다.',
  invalidUserId: '유효하지 않은 사용자 ID입니다.',
  usernameAlreadyExists: '이미 사용 중인 사용자명입니다.',
  invalidEmailFormat: '올바르지 않은 이메일 형식입니다.',
  invalidPasswordFormat: '비밀번호는 8자 이상이어야 합니다.',

  // 사용자 통계
  getUserStatsSuccess: '사용자 통계 조회 성공',
  getUserStatsError: '사용자 통계 조회 실패',

  // 마지막 로그인
  updateLastLoginSuccess: '마지막 로그인 시간 업데이트 성공',
  updateLastLoginError: '마지막 로그인 시간 업데이트 실패',
};
