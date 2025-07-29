# 메인 (Common) 라우트 그룹 체크리스트

`app/(common)` 경로의 각 기능별 필요 작업, 액션, 진척도 현황입니다.

**아키텍처 원칙**
-   **UI 액션 (`*.action.ts`)**: `_actions` 폴더에 위치. `useActionState`와 연결되어 폼 데이터를 처리하고, 핵심 로직 함수를 호출한 뒤 UI 상태를 반환합니다.
-   **핵심 로직 함수 (`*.ts`)**: `*.action.ts`와 동일한 `_actions` 폴더 내에 위치. 실제 DB 및 외부 서비스 통신을 담당합니다.

---

## 1. 메인 페이지 (홈)

-   **경로**: `/`
-   **진척도**: `[20%] - 기본 UI 및 세션 표시는 완료, 데이터 연동 필요`

### 기능 및 액션 체크리스트

-   [x] **세션 상태 표시**
    -   **세부 구현**:
        -   `page`: `app/(common)/page.tsx`
        -   `component`: `app/(common)/_components/Home.tsx`

-   [ ] **블로그 목록 및 최신 게시글 표시**
    -   **세부 구현**:
        -   `page`: `app/(common)/page.tsx` (데이터 로딩)
        -   `component`: `app/(common)/_components/Home.tsx` (데이터 렌더링)
        -   `UI 액션`: `getHomeDataAction` (`app/(common)/_actions/home.action.ts`)
        -   `핵심 로직 파일 (블로그)`: `app/(common)/_actions/get-all-blogs.ts`
        -   `핵심 로직 파일 (게시글)`: `app/(common)/_actions/get-recent-posts.ts`

---

## 2. 소개 페이지

-   **경로**: `/about`
-   **진척도**: `[10%] - 플레이스홀더 페이지만 존재`

### 기능 및 액션 체크리스트

-   [ ] **콘텐츠 작성**
    -   **세부 구현**:
        -   `page`: `app/(common)/about/page.tsx`
        -   `component`: `app/(common)/_components/About.tsx`
        -   **[TODO]**: 컴포넌트 내용 채우기 (별도 액션 불필요)

---

## 3. 프로필 페이지

-   **경로**: `/profile`
-   **진척도**: `[10%] - 플레이스홀더 페이지만 존재`

### 기능 및 액션 체크리스트

-   [ ] **프로필 정보 표시**
    -   **세부 구현**:
        -   `page`: `app/(common)/profile/page.tsx`
        -   `component`: `app/(common)/_components/Profile.tsx`
        -   `UI 액션`: `getProfileAction` (`app/(common)/profile/_actions/profile.action.ts`)
        -   `핵심 로직 파일`: `app/(common)/profile/_actions/get-profile.ts`


