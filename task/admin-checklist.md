# 통합 어드민 라우트 그룹 체크리스트

`app/(admin)` 경로의 각 기능별 필요 작업, 액션, 진척도 현황입니다.

**아키텍처 원칙**
-   **UI 액션 (`*.action.ts`)**: `_actions` 폴더에 위치. `useActionState`와 연결되어 폼 데이터를 처리하고, 핵심 로직 함수를 호출한 뒤 UI 상태를 반환합니다.
-   **핵심 로직 함수 (`*.ts`)**: `*.action.ts`와 동일한 `_actions` 폴더 내에 위치. 실제 DB 및 외부 서비스 통신을 담당합니다.

---

## 1. 통합 대시보드

-   **경로**: `/admin`
-   **진척도**: `[10%] - 플레이스홀더 페이지만 존재`

### 기능 및 액션 체크리스트

-   [ ] **통계 데이터 표시**
    -   **세부 구현**:
        -   `page`: `app/(admin)/admin/page.tsx`
        -   `component`: `app/(admin)/admin/_components/Admin.tsx`
        -   `UI 액션`: `getDashboardDataAction` (`app/(admin)/admin/_actions/dashboard.action.ts`)
        -   `핵심 로직 파일`: `app/(admin)/admin/_actions/get-global-stats.ts`

---

## 2. 블로그 관리

-   **경로**: `/admin/blogs/**`
-   **진척도**: `[20%] - 기본 구조만 존재`

### 기능 및 액션 체크리스트

-   [ ] **블로그 목록 조회**
    -   **세부 구현**:
        -   `page`: `app/(admin)/admin/blogs/list/page.tsx`
        -   `component`: `app/(admin)/admin/blogs/list/_components/AdminBlogsList.tsx`
        -   `UI 액션`: `getBlogsAction` (`app/(admin)/admin/blogs/list/_actions/blogs.action.ts`)
        -   `핵심 로직 파일`: `app/(admin)/admin/blogs/list/_actions/get-all-blogs.ts`

-   [ ] **블로그 생성/수정/삭제**
    -   **세부 구현**:
        -   `page(new)`: `app/(admin)/admin/blogs/new/page.tsx`
        -   `component(new)`: `app/(admin)/admin/blogs/new/_components/AdminBlogNew.tsx`
        -   `UI 액션`: `manageBlogAction` (`app/(admin)/admin/blogs/new/_actions/manage-blog.action.ts`)
        -   `핵심 로직 파일`: `app/(admin)/admin/blogs/new/_actions/crud-blog.ts`

---

## 3. 통합 콘텐츠 관리

-   **경로**: `/admin/posts/**`, `/admin/categories/**`, `/admin/tags/**`
-   **진척도**: `[15%] - 기본 구조만 존재`

### 기능 및 액션 체크리스트

-   [ ] **통합 게시글 관리 (CRUD)**
    -   **세부 구현**:
        -   `page(list)`: `app/(admin)/admin/posts/list/page.tsx`
        -   `page(new)`: `app/(admin)/admin/posts/new/page.tsx`
        -   `UI 액션`: `managePostAction` (`app/(admin)/admin/posts/new/_actions/manage-post.action.ts`)
        -   `핵심 로직 파일`: `app/(admin)/admin/posts/new/_actions/crud-post.ts`

-   [ ] **통합 카테고리 관리 (CRUD)**
    -   **세부 구현**:
        -   `page(list)`: `app/(admin)/admin/categories/list/page.tsx`
        -   `page(new)`: `app/(admin)/admin/categories/new/page.tsx`
        -   `UI 액션`: `manageCategoryAction` (`app/(admin)/admin/categories/new/_actions/manage-category.action.ts`)
        -   `핵심 로직 파일`: `app/(admin)/admin/categories/new/_actions/crud-category.ts`

-   [ ] **통합 태그 관리 (CRUD)**
    -   **세부 구현**:
        -   `page(list)`: `app/(admin)/admin/tags/list/page.tsx`
        -   `page(new)`: `app/(admin)/admin/tags/new/page.tsx`
        -   `UI 액션`: `manageTagAction` (`app/(admin)/admin/tags/new/_actions/manage-tag.action.ts`)
        -   `핵심 로직 파일`: `app/(admin)/admin/tags/new/_actions/crud-tag.ts`

---

## 4. 통합 설정

-   **경로**: `/admin/settings/**`
-   **진척도**: `[10%] - 플레이스홀더 페이지만 존재`

### 기능 및 액션 체크리스트

-   [ ] **기본 환경설정**
    -   **세부 구현**:
        -   `page`: `app/(admin)/admin/settings/default-preference/page.tsx`
        -   `component`: `app/(admin)/admin/settings/default-preference/_components/AdminDefaultPreference.tsx`
        -   `UI 액션`: `manageSiteSettingsAction` (`.../_actions/settings.action.ts`)
        -   `핵심 로직 파일`: `.../_actions/crud-settings.ts`

-   [ ] **관리자 프로필 설정**
    -   **세부 구현**:
        -   `page`: `app/(admin)/admin/settings/profile/page.tsx`
        -   `component`: `app/(admin)/admin/settings/profile/_components/AdminProfile.tsx`
        -   `UI 액션`: `manageUserProfileAction` (`.../_actions/profile.action.ts`)
        -   `핵심 로직 파일`: `.../_actions/crud-profile.ts`

