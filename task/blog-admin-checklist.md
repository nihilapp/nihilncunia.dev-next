# 개별 블로그 어드민 라우트 그룹 체크리스트

`app/(blog_admin)` 경로의 각 기능별 필요 작업, 액션, 진척도 현황입니다.

**아키텍처 원칙**
-   **UI 액션 (`*.action.ts`)**: `_actions` 폴더에 위치. `useActionState`와 연결되어 폼 데이터를 처리하고, 핵심 로직 함수를 호출한 뒤 UI 상태를 반환합니다.
-   **핵심 로직 함수 (`*.ts`)**: `*.action.ts`와 동일한 `_actions` 폴더 내에 위치. 실제 DB 및 외부 서비스 통신을 담당합니다.

---

## 1. 개별 블로그 대시보드

-   **경로**: `/blogs/[blog_id]/admin`
-   **진척도**: `[15%] - 기본 구조만 존재`

### 기능 및 액션 체크리스트

-   [ ] **블로그별 통계 데이터 표시**
    -   **세부 구현**:
        -   `page`: `app/(blog_admin)/blogs/[blog_id]/admin/page.tsx`
        -   `component`: `app/(blog_admin)/blogs/[blog_id]/admin/_components/BlogAdmin.tsx`
        -   `UI 액션`: `getBlogDashboardDataAction` (`.../admin/_actions/dashboard.action.ts`)
        -   `핵심 로직 파일`: `.../admin/_actions/get-blog-stats.ts`

---

## 2. 게시글 관리 (블로그 단위)

-   **경로**: `/blogs/[blog_id]/admin/posts/**`
-   **진척도**: `[20%] - 기본 구조만 존재`

### 기능 및 액션 체크리스트

-   [ ] **게시글 목록 조회**
    -   **세부 구현**:
        -   `page`: `.../admin/posts/list/page.tsx`
        -   `component`: `.../admin/posts/list/_components/BlogAdminPostsList.tsx`
        -   `UI 액션`: `getPostsAction` (`.../list/_actions/posts.action.ts`)
        -   `핵심 로직 파일`: `.../list/_actions/get-posts-by-blog.ts`

-   [ ] **게시글 생성/수정**
    -   **세부 구현**:
        -   `page(new)`: `.../admin/posts/new/page.tsx`
        -   `page(edit)`: `.../posts/[post_id]/edit/page.tsx` (이 페이지는 (blog_admin)으로 이동 고려)
        -   `UI 액션`: `managePostAction` (`.../new/_actions/manage-post.action.ts`)
        -   `핵심 로직 파일`: `.../new/_actions/crud-post.ts`
        -   **[TODO]** 마크다운 에디터 컴포넌트 구현 및 연동 필요.

---

## 3. 카테고리 및 태그 관리 (블로그 단위)

-   **경로**: `/blogs/[blog_id]/admin/categories/**`, `/blogs/[blog_id]/admin/tags/**`
-   **진척도**: `[20%] - 기본 구조만 존재`

### 기능 및 액션 체크리스트

-   [ ] **카테고리 관리 (CRUD)**
    -   **세부 구현**:
        -   `page(list)`: `.../admin/categories/list/page.tsx`
        -   `page(new)`: `.../admin/categories/new/page.tsx`
        -   `UI 액션`: `manageCategoryAction` (`.../new/_actions/manage-category.action.ts`)
        -   `핵심 로직 파일`: `.../new/_actions/crud-category.ts`

-   [ ] **태그 관리 (CRUD)**
    -   **세부 구현**:
        -   `page(list)`: `.../admin/tags/list/page.tsx`
        -   `page(new)`: `.../admin/tags/new/page.tsx`
        -   `UI 액션`: `manageTagAction` (`.../new/_actions/manage-tag.action.ts`)
        -   `핵심 로직 파일`: `.../new/_actions/crud-tag.ts`

---

## 4. 블로그 설정

-   **경로**: `/blogs/[blog_id]/admin/settings`
-   **진척도**: `[15%] - 기본 구조만 존재`

### 기능 및 액션 체크리스트

-   [ ] **블로그 정보 수정**
    -   **세부 구현**:
        -   `page`: `.../admin/settings/page.tsx`
        -   `component`: `.../admin/settings/_components/BlogAdminSettings.tsx`
        -   `UI 액션`: `manageBlogSettingsAction` (`.../settings/_actions/settings.action.ts`)
        -   `핵심 로직 파일`: `.../settings/_actions/crud-blog-settings.ts`

