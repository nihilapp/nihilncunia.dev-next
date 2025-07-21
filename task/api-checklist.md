# API 개발 체크 리스트

본 문서는 블로그 매니지먼트 시스템 프로젝트에서 사용될 주요 API들과 그 기능을 정리한 것입니다. Next.js App Router의 파일 기반 라우팅 시스템을 사용하여 구현됩니다.

---

## 📌 플랫폼 관리 API (Platform Management)

### 1. 인증(Auth) API

> **참고**: 커스텀 인증 시스템으로 다음 기능들을 구현해야 합니다:
>
> - 로그인: JWT 토큰 기반 인증 API
> - 로그아웃: 토큰 무효화 API
> - 세션 조회: 토큰 검증 API
> - 토큰 갱신: JWT callback에서 자동 처리

### 2. 사용자(User) API

- [ ] **GET** `app/api/users/route.ts` - 사용자 목록을 조회합니다.
- [ ] **GET** `app/api/users/[id]/route.ts` - 특정 사용자의 상세 정보를 가져옵니다.
- [ ] **GET** `app/api/users/email/[email]/route.ts` - 이메일로 사용자를 검색합니다.
- [ ] **GET** `app/api/users/username/[username]/route.ts` - 사용자명으로 사용자를 검색합니다.
- [ ] **POST** `app/api/users/route.ts` - 사용자를 새로 생성합니다. (요청 데이터: `email`, `name`, `role`, `password`)
- [ ] **PUT** `app/api/users/[id]/route.ts` - 사용자 기본 정보를 수정합니다.
- [ ] **PUT** `app/api/users/[id]/password/route.ts` - 사용자 비밀번호를 변경합니다.
- [ ] **PUT** `app/api/users/[id]/image/route.ts` - 프로필 이미지를 수정합니다.
- [ ] **DELETE** `app/api/users/[id]/route.ts` - 사용자를 삭제합니다.
- [ ] **DELETE** `app/api/users/route.ts` - 여러 사용자를 한 번에 삭제합니다. (요청 데이터: `ids` 배열)
