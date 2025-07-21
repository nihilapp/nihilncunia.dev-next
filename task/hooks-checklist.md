# 리액트 커스텀 훅 체크 리스트

본 문서는 블로그 매니지먼트 시스템(멀티 블로그) 프로젝트의 React Query 기반 커스텀 훅 구현 항목을 API와 1:1로 매칭하여 정리한 체크리스트입니다.

---

## 📌 플랫폼 관리 훅 (Platform Management)

### 1. 인증(Auth) 훅

> **참고**: 커스텀 인증 사용으로 다음 기능들은 커스텀 훅 사용:
>
> - 로그인: `signIn()` 함수
> - 로그아웃: `signOut()` 함수
> - 세션 조회: `useSession()` 또는 `auth()` 함수

### 2. 사용자(User) 훅

- [ ] **useGetUsers** - `GET /api/users` - 사용자 목록 조회
- [ ] **useGetUserById** - `GET /api/users/[id]` - 특정 사용자 상세 조회
- [ ] **useGetUserByEmail** - `GET /api/users/email/[email]` - 이메일로 사용자 검색
- [ ] **useGetUserByUsername** - `GET /api/users/username/[username]` - 사용자명으로 사용자 검색
- [ ] **useCreateUser** - `POST /api/users` - 사용자 생성
- [ ] **useUpdateUser** - `PUT /api/users/[id]` - 사용자 기본 정보 수정
- [ ] **useUpdateUserPassword** - `PUT /api/users/[id]/password` - 사용자 비밀번호 변경
- [ ] **useUpdateUserImage** - `PUT /api/users/[id]/image` - 프로필 이미지 수정
- [ ] **useDeleteUser** - `DELETE /api/users/[id]` - 사용자 삭제
- [ ] **useDeleteUsers** - `DELETE /api/users` - 사용자 일괄 삭제
