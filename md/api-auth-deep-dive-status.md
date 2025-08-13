### API/Auth 심층 분석 및 구현 현황 매핑

**범위**: `app/api/`, `app/_entities/auth/`, `app/(auth)/`

**참고 문서**: `md/과제진행현황.md`, `md/구현체크리스트.md`

---

### 전체 개요

**핵심 요약**: 인증(Auth) API는 로그인, 회원가입, 로그아웃, 세션 검증, 관리자 회원가입(2단계), 비밀번호 재설정(토큰 기반)까지 전 기능이 구현되어 있고, 서비스/DAO 레이어로 리팩토링이 완료되었습니다.

**비어있는/부족한 지점**: `users` 관련 API 라우트는 파일만 존재하거나 주석만 있으며 미구현 상태입니다. 체크리스트에 완료로 표시된 OTP API는 실제 라우트가 보이지 않습니다.

---

### 기능별 상세 매핑

#### 1) 사용자 회원가입

- **엔드포인트**: `POST /api/auth/signup`

- **HTTP 메서드**: POST

- **API 라우트 파일**: `app/api/auth/signup/route.ts`

- **호출 서비스 메서드**: `authService.signUp(signUpData)` → `AuthService.signUp()` → `AuthDao.createUser()`, `AuthDao.findUserByEmail()`

- **관여 유틸**: `BcryptHelper`, `Logger`

- **프론트 API 함수**: `app/_entities/auth/auth.api.ts` → `signUp()`

- **관련 훅/폼**: `hooks/useSignUp.ts`, 페이지 `app/(auth)/auth/signup/*`

- **상태**: 구현 완료

#### 2) 사용자 로그인

- **엔드포인트**: `POST /api/auth/signin`

- **HTTP 메서드**: POST

- **API 라우트 파일**: `app/api/auth/signin/route.ts`

- **호출 서비스 메서드**: `authService.signIn(signInData)` → `AuthService.signIn()` → `AuthDao.findUserByEmailWithPassword()`, `JwtHelper.genTokens()`, `AuthDao.updateRefreshToken()`

- **관여 유틸**: `BcryptHelper`, `JwtHelper`, `CookieHelper`, `Logger`, `getServerConfig`

- **프론트 API 함수**: `auth.api.ts` → `signIn()`

- **관련 훅/폼**: `hooks/useSignIn.ts`, 페이지 `app/(auth)/auth/signin/*`

- **상태**: 구현 완료

#### 3) 로그아웃

- **엔드포인트**: `POST /api/auth/signout`

- **HTTP 메서드**: POST

- **API 라우트 파일**: `app/api/auth/signout/route.ts`

- **호출 서비스 메서드**: `authService.signOut(userId)` → `AuthService.signOut()` → `AuthDao.updateRefreshToken(null)`

- **관여 유틸**: `CookieHelper`, `JwtHelper`, `Logger`

- **프론트 API 함수**: `auth.api.ts` → `signOut()`

- **관련 훅/폼**: `hooks/useSignOut.ts`

- **상태**: 구현 완료

#### 4) 세션 검증 및 토큰 갱신

- **엔드포인트**: `GET /api/auth/session`

- **HTTP 메서드**: GET

- **API 라우트 파일**: `app/api/auth/session/route.ts`

- **호출 서비스 메서드**: `authService.verifySession(accessToken, refreshToken)` → `AuthService.verifySession()` → `JwtHelper.verifyWithUser()`, `JwtHelper.genTokens()`, `AuthDao.findUserById()`, `AuthDao.updateRefreshToken()`

- **관여 유틸**: `CookieHelper`, `Logger`, `getServerConfig`

- **프론트 API 함수**: `auth.api.ts` → `verifySession()`

- **관련 훅/스토어**: `hooks/useSession.ts`, `auth.store.ts`

- **상태**: 구현 완료

#### 5) 관리자 회원가입(2단계)

- **엔드포인트**: `POST /api/auth/admin/signup`

- **HTTP 메서드**: POST

- **API 라우트 파일**: `app/api/auth/admin/signup/route.ts`

- **호출 서비스 메서드**: 

  - 1단계 코드발송: `authService.createAdminVerification()` → `AuthService.createAdminVerification()` → `AuthDao.invalidateAllAdminVerificationCodes()`, `AuthDao.createAdminVerificationCode()`

  - 2단계 코드검증: `authService.verifyAdminCode(code)` → `AuthService.verifyAdminCode()` → `AuthDao.findValidAdminVerificationCodes()`, `AuthDao.markAdminVerificationCodeAsUsed()`

  - 계정 생성: `authService.signUpAdmin(data)` → `AuthService.signUpAdmin()` → `AuthDao.createAdminUser()`

- **관여 유틸**: `BcryptHelper`, `EmailHelper`, `Logger`, `getServerConfig`

- **프론트 API 함수**: `auth.api.ts` → `requestAdminSignUp()`, `completeAdminSignUp()`

- **관련 훅/폼**: `hooks/useRequestAdminSignUp.ts`, `hooks/useCompleteAdminSignUp.ts`, 페이지 `app/(auth)/auth/admin/signup/*`

- **상태**: 구현 완료

#### 6) 비밀번호 재설정(토큰 기반)

- **1단계: 이메일 발송**

  - **엔드포인트**: `POST /api/auth/verify-email`

  - **API 라우트 파일**: `app/api/auth/verify-email/route.ts`

  - **서비스 메서드**: `authService.resetPasswordAndSendEmail(email)` → `AuthService.requestPasswordReset()` → `AuthDao.invalidateAllPasswordResetTokens()`, `AuthDao.createPasswordResetToken()`

  - **관여 유틸**: `CommonHelper`, `BcryptHelper`, `EmailHelper`, `Logger`

  - **프론트 API 함수/훅/폼**: `auth.api.ts` → `sendResetPasswordEmail()`, `hooks/useSendResetPasswordEmail.ts`, 폼 `ForgotPasswordForm`

  - **상태**: 구현 완료

- **2단계: 비밀번호 변경**

  - **엔드포인트**: `POST /api/auth/reset-password`

  - **API 라우트 파일**: `app/api/auth/reset-password/route.ts`

  - **서비스 메서드**: `authService.resetPasswordWithTemp(email, tempPassword, newPassword)` → `AuthService.resetPassword()` → `AuthDao.findValidPasswordResetToken()`, `AuthDao.markPasswordResetTokenAsUsed()`, `AuthDao.updatePassword()`

  - **관여 유틸**: `BcryptHelper`, `Logger`

  - **프론트 API 함수/훅/폼**: `auth.api.ts` → `resetPassword()`, `hooks/useResetPassword.ts`, 폼 `ResetPasswordForm`

  - **상태**: 구현 완료

---

### (auth) 라우트 그룹 상태

- **로그인 페이지**: `app/(auth)/auth/signin/page.tsx` 및 `_components` 구현 완료

- **회원가입 페이지**: `app/(auth)/auth/signup/page.tsx` 및 `_components` 구현 완료

- **비밀번호 재설정**: `app/(auth)/auth/forgot-password/page.tsx`, `app/(auth)/auth/reset-password/page.tsx` 및 각 폼 컴포넌트 구현 완료

- **관리자 회원가입**: `app/(auth)/auth/admin/signup/page.tsx` 및 단계형 컴포넌트 구현 완료

---

### Users 관련 API 상태(참고)

- **`GET /api/users/[id]`**: 라우트 파일 존재하나 주석만 있고 미구현 → `app/api/users/[id]/route.ts`

- **`PATCH /api/users/[id]`**: 동일 파일에 미구현

- **`PATCH /api/users/[id]/password`**: 라우트 파일에 주석만 존재 → `app/api/users/[id]/password/route.ts`

- **프론트 타입/키/스토어**: `@/_entities/users/*` 일부 타입만 존재, API/서비스/훅 구현 여부는 추가 확인 필요

---

### 체크리스트/현황 문서 대비 차이점 및 보완 필요

- **OTP API**: 체크리스트에 `POST /api/auth/otp`, `POST /api/auth/otp/verify` 가 완료로 표기되어 있으나, 실제 `app/api` 내 해당 라우트가 존재하지 않습니다. 구현 여부 재점검 필요.

- **비밀번호 재설정 페이지**: 체크리스트에 일부 페이지가 빈 파일로 표기되어 있으나, 실제로 `ForgotPasswordForm`, `ResetPasswordForm`이 구현되어 동작합니다. 체크상태 업데이트 필요.

- **Users API**: 체크리스트에서 미구현으로 표기된 상태와 실제 코드가 일치합니다. 구현 계획 수립 필요.

---

### 단위 기능별 메서드 사용 요약

- **인증 토큰**: `JwtHelper.verifyWithUser()`, `JwtHelper.genTokens()`

- **쿠키 처리**: `CookieHelper.get()`, `CookieHelper.set()`, `CookieHelper.remove()`

- **비밀번호 해시/검증**: `BcryptHelper.dataToHash()`, `BcryptHelper.dataCompare()`

- **이메일 발송**: `EmailHelper.sendTemporaryPassword()`, `EmailHelper.sendVerificationCode()`

- **토큰/코드 저장/검증(DAO)**: `createPasswordResetToken()`, `findValidPasswordResetToken()`, `markPasswordResetTokenAsUsed()`, `invalidateAllPasswordResetTokens()`, `createAdminVerificationCode()`, `findValidAdminVerificationCodes()`, `markAdminVerificationCodeAsUsed()`, `invalidateAllAdminVerificationCodes()`

---

### 보완 및 다음 액션 제안

- **Users API 구현**: `GET /api/users/[id]`, `PATCH /api/users/[id]`, `PATCH /api/users/[id]/password` 라우트 구현. 서비스/DAO 레이어 일관성 유지 권장.

- **OTP API 정합성**: 체크리스트와 실제 코드 정합성 재검토. 미구현 시 라우트/서비스/DAO/프론트 훅 추가 필요.

- **문서 싱크**: `md/구현체크리스트.md`의 상태표시를 실제 구현 상황에 맞게 업데이트.

- **보안 강화(관리자 인증 시도 제한)**: `md/과제진행현황.md`의 계획(시도 횟수 제한, 잠금, 만료 타이머, 로깅)을 DAO/Service/프론트에 반영.

---

### 파일 트레이스(요약)

- **API 라우트**: `app/api/auth/*`, `app/api/users/[id]/*`

- **서비스/DAO**: `app/_entities/auth/service/auth.service.ts`, `app/_entities/auth/dao/auth.dao.ts`, `app/_entities/auth/auth.service.ts`, `app/_entities/auth/auth.factory.ts`

- **프론트 API**: `app/_entities/auth/auth.api.ts`

- **훅**: `app/_entities/auth/hooks/*`

- **페이지/컴포넌트**: `app/(auth)/auth/**/*`
