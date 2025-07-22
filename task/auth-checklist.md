# 인증 프로세스 구현 체크리스트
모든 함수에는 파일 상단에 use server 디렉티브가 붙어있어야 합니다.

## 1. 패스코드 인증 시스템

### 1.1 패스코드 생성 및 관리
- **nodemailer 를 이용해서 패스코드를 process.env.MAIL_FROM 이메일을 이용해서 process.env.MAIL_TO 이메일로 발송한다.**
- [ ] `generatePasscode()`: 60자리 숫자+영대소문자 조합 생성
- [ ] `sendPasscodeEmail()`: 마스터 이메일로 패스코드 전송 (메일로 발송된 후 5분 안에 입력해야한다.)
- [ ] `validatePasscode()`: 입력된 패스코드 검증 (5분 안에 입력을 성공하면 24시간 동안 다시 인증할 필요가 없다. 이 정보를 쿠키에 저장한다.)

### 1.2 패스코드 관련 페이지
- **인증이 필요한 페이지에 접근시에 auth/passcode 페이지로 리다이렉트 하고, 인증을 마치고 나면 원래 페이지로 다시 보내준다.**
- [ ] `/auth/passcode` 페이지 생성
- [ ] 패스코드 입력 폼 UI 구현
- [ ] 패스코드 검증 로직 연결
- [ ] 인증 성공 시 리다이렉트 처리

## 2. OTP 시스템

### 2.1 OTP 생성 및 관리
- **OTP의 경우 otplib 을 이용해서 생성하고 시크릿을 DB에 저장한다.**  
- [ ] `generateOTP()`: 계정별 고유 OTP 생성
- [ ] `registerOTP()`: 계정 생성 시 OTP를 DB에 저장
- [ ] `validateOTP()`: 로그인 시 OTP 입력값 검증
- [ ] `updateOTP()`: OTP 변경 기능

### 2.2 OTP 관련 UI
- [ ] 계정 생성 시 OTP 등록 폼
- [ ] 로그인 시 OTP 입력 폼
- [ ] OTP 변경 페이지 `/auth/otp-create` 구성 (OTP 재설정)

## 3. Supabase 인증 연동

### 3.1 계정 관리
- [ ] `createAccount()`: Supabase Auth + OTP 등록
- [ ] `signIn()`: Supabase Auth + OTP 검증
- [ ] `signOut()`: Supabase Auth 로그아웃
- [ ] `resetPassword()`: 비밀번호 재설정

### 3.2 인증 상태 관리
- [ ] `checkAuthStatus()`: 현재 인증 상태 확인
- [ ] `getCurrentUser()`: 현재 사용자 정보 조회
- [ ] `requireAuth()`: 인증 필요 페이지 접근 제어

## 4. 보안 강화

### 4.1 접근 제어
- [ ] `blockRobots()`: robots.txt 설정
- [ ] `blockSearchEngines()`: meta 태그로 검색엔진 차단
- [ ] `protectAdminRoutes()`: 어드민 페이지 접근 제어
- [ ] `rateLimit()`: 패스코드 입력 시도 제한

### 4.2 세션 관리
- [ ] `createAdminSession()`: 어드민 세션 생성
- [ ] `validateAdminSession()`: 어드민 세션 검증
- [ ] `clearAdminSession()`: 어드민 세션 삭제

## 5. 데이터베이스 스키마

### 5.1 사용자 테이블 확장
- [ ] `otp_string` 컬럼 추가
- [ ] `is_admin` 컬럼 추가
- [ ] `passcode_verified_at` 컬럼 추가

### 5.2 세션 관리 테이블
- [ ] 패스코드 세션 테이블 생성
- [ ] OTP 세션 테이블 생성

## 6. 서버 액션

### 6.1 패스코드 관련 서버 액션
- [ ] `generatePasscodeAction()`: 패스코드 생성 및 이메일 발송
- [ ] `validatePasscodeAction()`: 패스코드 검증
- [ ] `verifyPasscodeAction()`: 패스코드 인증 완료

### 6.2 OTP 관련 서버 액션
- [ ] `generateOTPAction()`: OTP 생성
- [ ] `registerOTPAction()`: OTP 등록
- [ ] `validateOTPAction()`: OTP 검증
- [ ] `updateOTPAction()`: OTP 변경

### 6.3 계정 관리 서버 액션
- [ ] `signupAction()`: 계정 생성 (Supabase + OTP)
- [ ] `signinAction()`: 로그인 (Supabase + OTP)
- [ ] `signoutAction()`: 로그아웃
- [ ] `resetPasswordAction()`: 비밀번호 재설정

## 7. 미들웨어 및 가드

### 7.1 라우트 보호
- [ ] `adminGuard`: 어드민 페이지 접근 제어
- [ ] `authGuard`: 인증 필요 페이지 접근 제어
- [ ] `passcodeGuard`: 패스코드 인증 필요 페이지 접근 제어

### 7.2 미들웨어
- [ ] `authMiddleware`: 인증 상태 확인
- [ ] `adminMiddleware`: 어드민 권한 확인
- [ ] `rateLimitMiddleware`: 요청 제한

## 8. 유틸리티 함수

### 8.1 이메일 관련
- [ ] `sendEmail()`: 이메일 발송 유틸리티
- [ ] `formatEmailTemplate()`: 이메일 템플릿 포맷팅

### 8.2 보안 관련
- [ ] `generateSecureToken()`: 보안 토큰 생성
- [ ] `hashSensitiveData()`: 민감 데이터 해싱
- [ ] `validateInput()`: 입력값 검증

## 9. 에러 처리

### 9.1 인증 에러
- [ ] 패스코드 만료 에러 처리
- [ ] OTP 불일치 에러 처리
- [ ] 인증 실패 에러 처리
- [ ] 권한 부족 에러 처리

### 9.2 사용자 친화적 에러 메시지
- [ ] 한국어 에러 메시지 정의
- [ ] 에러 페이지 UI 구현
- [ ] 에러 로깅 시스템

## 10. 테스트

### 10.1 단위 테스트
- [ ] 패스코드 생성/검증 테스트
- [ ] OTP 생성/검증 테스트
- [ ] 인증 플로우 테스트

### 10.2 통합 테스트
- [ ] 전체 인증 플로우 테스트
- [ ] 보안 테스트
- [ ] 에러 케이스 테스트

## 11. 문서화

### 11.1 서버 액션 문서
- [ ] 인증 서버 액션 문서 작성
- [ ] 에러 코드 문서 작성
- [ ] 사용법 가이드 작성

### 11.2 보안 문서
- [ ] 보안 정책 문서
- [ ] 접근 제어 정책
- [ ] 인시던트 대응 가이드

---

## 구현 우선순위

1. **1단계**: 기본 패스코드 시스템 (1.1, 1.2)
2. **2단계**: OTP 시스템 (2.1, 2.2)
3. **3단계**: Supabase 연동 (3.1, 3.2)
4. **4단계**: 보안 강화 (4.1, 4.2)
5. **5단계**: 서버 액션 및 미들웨어 (6, 7)
6. **6단계**: 테스트 및 문서화 (10, 11) 