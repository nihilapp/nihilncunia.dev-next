# 인증 및 세션 시스템 분석 결과

전반적으로 최신 기술 스택(Next.js, React Query, Zustand, Prisma)을 활용하여 잘 구조화되어 있으며, 보안적으로 많은 부분을 고려한 것으로 보입니다. 특히 Access Token과 Refresh Token을 분리하여 사용하고, `HttpOnly`, `Secure`, `SameSite=Strict` 쿠키 옵션을 적용한 점은 매우 훌륭합니다.

하지만 몇 가지 잠재적인 취약점과 개선점이 발견되었습니다.

### 1. 전체 아키텍처 요약

1.  **프론트엔드 (Client)**:
    *   `app/(auth)`: 로그인/회원가입 UI 컴포넌트 제공.
    *   `@/_entities/auth/hooks`: `useSignIn`, `useSignUp` 등 React Query의 `useMutation`을 사용하여 서버 API와 통신.
    *   `@/_entities/auth/auth.store.ts`: Zustand를 사용하여 클라이언트의 인증 상태(`isAuthenticated`, `user` 정보)를 관리. 이 정보는 `localStorage`에 저장되어 브라우저를 새로고침해도 유지됩니다.
    *   `@/_entities/auth/hooks/useSession.ts`: 앱 로드 시 또는 필요 시 서버에 세션 유효성을 검증(`verifySession`)하고, 클라이언트 상태를 동기화합니다.

2.  **백엔드 (Server API - Next.js Route Handlers)**:
    *   `app/api/auth/signup/route.ts`: 회원가입 요청 처리. `AuthService.signUp` 호출.
    *   `app/api/auth/signin/route.ts`: 로그인 요청 처리. `AuthService.signIn` 호출 후 성공 시 `access_token`과 `refresh_token`을 `HttpOnly` 쿠키에 설정.
    *   `app/api/auth/session/route.ts` (추정): `middleware.ts`나 `useSession` 훅에서 호출되어 쿠키의 토큰을 검증하고 세션을 갱신.

3.  **서비스 로직 (`AuthService`)**:
    *   `signUp`: 이메일 중복 확인, `bcrypt`로 비밀번호 해싱 후 DB에 사용자 저장.
    *   `signIn`: 사용자 조회, `bcrypt`로 비밀번호 검증, 성공 시 `jose` 라이브러리를 이용해 JWT(Access/Refresh) 토큰 생성, Refresh Token은 DB에 저장.
    *   `verifySession`: Access Token 검증, 만료 시 Refresh Token으로 새로운 토큰 쌍 발급 및 DB 업데이트.
    *   `signOut`: DB에서 Refresh Token 제거하여 세션 무효화.

4.  **세션 관리**:
    *   Access/Refresh Token을 사용하는 표준적인 JWT 기반 세션 관리.
    *   토큰은 `HttpOnly` 쿠키에 저장되어 XSS 공격으로부터 비교적 안전.
    *   `middleware.ts`가 현재 비활성화되어 있어, 페이지 접근 제어는 클라이언트 사이드(`AuthLayoutProvider`)에서 주로 이루어지고 있습니다.

---

### 2. 발견된 취약점 및 개선 사항

#### 🔴 중요도: 높음 (High)

**1. 권한 상승 취약점 (Privilege Escalation)**

*   **위치**: `app/api/auth/signup/route.ts` -> `AuthService.signUp`
*   **문제점**: 회원가입 시 클라이언트(`SignUpForm.tsx`)에서 보낸 `role` 값(`USER` 또는 `ADMIN`)을 서버에서 아무런 검증 없이 그대로 DB에 저장합니다. 악의적인 사용자가 회원가입 요청을 조작하여 `role`을 `'ADMIN'`으로 설정하면 관리자 계정을 생성할 수 있습니다.
*   **영향**: 시스템 전체를 장악할 수 있는 치명적인 보안 허점입니다.
*   **개선 방안**:
    *   **서버에서 역할 강제**: `AuthService.signUp`에서 `role` 값을 무조건 `'USER'`로 고정해야 합니다. 관리자 생성은 별도의 안전한 내부 API나 스크립트를 통해 이루어져야 합니다.

#### 🟡 중요도: 중간 (Medium)

**2. 서버 사이드 요청 위조(SSRF) 방어를 위한 미들웨어 부재**

*   **위치**: `middleware.ts`
*   **문제점**: 현재 `middleware.ts`가 비활성화되어 있습니다. 이는 서버에서 페이지 접근 제어를 수행하지 않는다는 의미입니다. 클라이언트 사이드에서 `AuthLayoutProvider`가 인증된 사용자를 리다이렉트하지만, API 요청이나 서버 컴포넌트 렌더링을 직접 시도하는 것을 막지는 못합니다. 예를 들어, 관리자만 접근해야 하는 페이지의 데이터를 API 요청으로 직접 호출할 경우 데이터가 노출될 수 있습니다.
*   **영향**: 보호되어야 할 페이지나 API 엔드포인트에 비인가 접근이 가능해질 수 있습니다.
*   **개선 방안**:
    *   **`middleware.ts` 활성화**: `middleware.ts`에서 `access_token` 쿠키를 확인하고, `JwtHelper.verifyWithUser`를 사용해 토큰을 검증해야 합니다.
    *   **경로 기반 접근 제어**: 요청 경로(`request.nextUrl.pathname`)를 확인하여 `/admin`과 같은 특정 경로는 관리자(`role === 'ADMIN'`)만 접근할 수 있도록 하고, 인증이 필요한 경로는 로그인 페이지로 리다이렉트 시켜야 합니다.
    *   **토큰 갱신 로직**: 미들웨어에서 Access Token 만료가 감지되면, Refresh Token을 사용하여 토큰을 갱신하고 새로운 토큰을 쿠키에 설정해주는 로직을 추가하면 사용자 경험을 향상시킬 수 있습니다.

**3. 로그아웃 시 토큰 완전 무효화 미흡**

*   **위치**: `AuthService.signOut`
*   **문제점**: 로그아웃 시 DB에서 Refresh Token만 제거합니다. 만약 Access Token이 탈취되었고 아직 만료되지 않았다면, 해당 토큰은 로그아웃 이후에도 계속 유효한 상태로 남게 됩니다.
*   **영향**: 탈취된 Access Token을 통해 만료 시간까지 비인가 접근이 가능합니다.
*   **개선 방안**:
    *   **Blacklist 구현**: 로그아웃된 토큰의 `jti`(JWT ID)나 `id`를 짧은 만료 시간을 가진 Redis나 다른 캐시 저장소에 블랙리스트로 등록합니다.
    *   **미들웨어나 API에서 확인**: 모든 요청에 대해 토큰을 검증할 때, 해당 토큰이 블랙리스트에 있는지 확인하는 절차를 추가합니다.

#### 🔵 중요도: 낮음 (Low) / 일반 권장 사항

**4. 에러 메시지 상세 노출**

*   **위치**: `AuthService.signIn`
*   **문제점**: 로그인 실패 시 "User not found" 또는 "Password incorrect"와 같이 실패 원인을 구체적으로 알려줍니다. 이는 공격자에게 특정 이메일의 가입 여부를 알려주는 단서(Username Enumeration)가 될 수 있습니다.
*   **영향**: 공격자가 시스템에 등록된 유효한 이메일 목록을 추측하는 데 도움을 줄 수 있습니다.
*   **개선 방안**:
    *   **일반적인 실패 메시지 사용**: 로그인 실패 시에는 원인에 관계없이 "이메일 또는 비밀번호가 올바르지 않습니다."와 같이 통일된 메시지를 반환하는 것이 좋습니다.

### 3. 총평

현재 인증 시스템은 좋은 기반 위에 구축되어 있습니다. 특히 JWT 토큰을 `HttpOnly` 쿠키에 저장하는 방식은 XSS 공격을 효과적으로 방어할 수 있는 좋은 선택입니다.

다만, **회원가입 시 역할(role)을 검증하지 않는 치명적인 문제**는 즉시 수정해야 합니다. 그 후 `middleware.ts`를 활성화하여 서버 사이드에서 강력한 접근 제어를 구현하고, 나머지 권장 사항들을 점진적으로 적용한다면 훨씬 더 안전하고 견고한 시스템이 될 것입니다.

---

### 인증 시스템 개선 To-Do 리스트

-   [ ] **(중요도: 높음)** `AuthService.signUp`에서 `role` 값을 항상 'USER'로 강제하여 관리자 계정 생성 취약점 해결
-   [ ] **(중요도: 중간)** `middleware.ts`를 활성화하여 경로 기반 접근 제어(예: `/admin` 경로 보호) 및 세션 검증 로직 구현
-   [ ] **(중요도: 중간)** 로그아웃 시 Access Token을 무효화하기 위한 블랙리스트 메커니즘 구현
-   [x] **(중요도: 낮음)** 로그인 실패 시 "이메일 또는 비밀번호가 올바르지 않습니다."와 같이 통일된 에러 메시지를 반환하도록 수정
-   [x] ✨ **새로 완성됨** 비밀번호 재설정 시스템 구현 완료
    - 임시 비밀번호 생성 및 이메일 발송 기능
    - 임시 비밀번호 검증 후 새 비밀번호 설정 기능
    - 완전한 2단계 비밀번호 재설정 플로우
    - 강력한 비밀번호 복잡성 검증 (8자 이상, 영대소문자/숫자/특수문자 포함)