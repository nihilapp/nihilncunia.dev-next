# 인증 (Auth) 라우트 그룹 체크리스트

`app/(auth)` 경로의 각 기능별 필요 작업, 액션, 진척도 현황입니다.

**아키텍처 원칙**
-   **UI 액션 (`*.action.ts`)**: `_actions` 폴더에 위치. `useActionState`와 연결되어 폼 데이터를 처리하고, 핵심 로직 함수를 호출한 뒤 UI 상태를 반환합니다.
-   **핵심 로직 함수 (`*.ts`)**: `*.action.ts`와 동일한 `_actions` 폴더 내에 위치. 실제 DB 및 외부 서비스 통신을 담당합니다.

---

## 1. 회원가입 (Sign Up)

-   **경로**: `/auth/signup/**`
-   **진척도**: `[100%] - 완성됨`

### 기능 및 액션 체크리스트

-   [x] **STEP 1: 사용자 정보 입력 및 검증**
    -   **세부 구현**:
        -   `page`: `app/(auth)/auth/signup/page.tsx`
        -   `component`: `app/(auth)/auth/signup/_components/SignUp.tsx`
        -   `UI 액션`: `signUpAction` (`signup.action.ts`)
        -   `핵심 로직 파일`: `validate-signup.ts`

-   [x] **STEP 2 & 3: OTP 설정, 검증 및 계정 생성**
    -   **세부 구현**:
        -   `page`: `app/(auth)/auth/signup/otp/page.tsx`
        -   `component`: `app/(auth)/auth/signup/otp/_components/SignUpOtp.tsx`
        -   `UI 액션`: `setupOtpAction` (`setup-otp.action.ts`)
        -   `핵심 로직 (QR 생성)`: `generate-otp.ts`
        -   `핵심 로직 (계정 생성)`: `create-user-with-otp.ts`

-   [x] **STEP 4: 회원가입 완료 페이지**
    -   **세부 구현**:
        -   `page`: `app/(auth)/auth/signup/complete/page.tsx`
        -   `component`: `app/(auth)/auth/signup/complete/_components/SignUpComplete.tsx`

---

## 2. 로그인 (Sign In)

-   **경로**: `/auth/signin/**`
-   **진척도**: `[100%] - 완성됨`

### 기능 및 액션 체크리스트

-   [x] **STEP 1: 이메일/비밀번호 인증**
    -   **세부 구현**:
        -   `page`: `app/(auth)/auth/signin/page.tsx`
        -   `component`: `app/(auth)/auth/signin/_components/SignIn.tsx`
        -   `UI 액션`: `signInAction` (`signin.action.ts`)
        -   `핵심 로직 파일`: `authenticate.ts`

-   [x] **STEP 2: OTP 인증**
    -   **세부 구현**:
        -   `page`: `app/(auth)/auth/signin/otp/page.tsx`
        -   `component`: `app/(auth)/auth/signin/otp/_components/SignInOtp.tsx`
        -   `UI 액션`: `verifyOtpAction` (`verify-otp.action.ts`)
        -   `핵심 로직 파일`: `verify-login.ts`

---

## 3. 보호막 인증 (Auth Guard)

-   **경로**: `/auth/guard/**`
-   **진척도**: `[100%] - 완성됨 (모범 사례)`

### 기능 및 액션 체크리스트

-   [x] **STEP 1: 패스코드 발송**
    -   **세부 구현**:
        -   `page`: `app/(auth)/auth/guard/page.tsx`
        -   `component`: `app/(auth)/auth/guard/_components/SendPasscode.tsx`
        -   `UI 액션`: `passCodeAction` (`passcode.action.ts`)
        -   `핵심 로직 파일`: `send-code.ts`

-   [x] **STEP 2: 패스코드 검증**
    -   **세부 구현**:
        -   `component`: `app/(auth)/auth/guard/_components/VerifyPasscode.tsx`
        -   `UI 액션`: `passCodeAction` (`passcode.action.ts`)
        -   `핵심 로직 파일`: `verify-code.ts`

-   [x] **STEP 3: 인증 완료 처리**
    -   **세부 구현**:
        -   `page`: `app/(auth)/auth/guard/complete/page.tsx`
        -   `component`: `app/(auth)/auth/guard/complete/_components/GuardComplete.tsx`
        -   `UI 액션`: `guardCompleteAction` (`guard-complete.action.ts`)
        -   `핵심 로직 파일`: `complete-guard.ts`

---

## 4. 비밀번호 재설정 (Forgot Password)

-   **경로**: `/auth/forgot-password`, `/auth/new-password`
-   **진척도**: `[10%] - 미완성`

### 기능 및 액션 체크리스트

-   [ ] **STEP 1: 비밀번호 재설정 요청**
    -   **세부 구현**:
        -   `page`: `app/(auth)/auth/forgot-password/page.tsx`
        -   `component`: `app/(auth)/auth/forgot-password/_components/ForgotPassword.tsx`
        -   `UI 액션`: `requestPasswordResetAction` (`forgot-password.action.ts`)
        -   `핵심 로직 파일`: `send-reset-link.ts`

-   [ ] **STEP 2: 새 비밀번호 설정**
    -   **세부 구현**:
        -   `page`: `app/(auth)/auth/new-password/page.tsx`
        -   `component`: `app/(auth)/auth/new-password/_components/NewPassword.tsx`
        -   `UI 액션`: `updatePasswordAction` (`new-password.action.ts`)
        -   `핵심 로직 파일`: `update-user-password.ts`




