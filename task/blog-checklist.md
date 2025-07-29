# 개별 블로그 (Public) 라우트 그룹 체크리스트

`app/(blog)` 경로의 각 기능별 필요 작업, 액션, 진척도 현황입니다.

**아키텍처 원칙**
-   **UI 액션 (`*.action.ts`)**: `_actions` 폴더에 위치. `useActionState`와 연결되어 폼 데이터를 처리하고, 핵심 로직 함수를 호출한 뒤 UI 상태를 반환합니다.
-   **핵심 로직 함수 (`*.ts`)**: `*.action.ts`와 동일한 `_actions` 폴더 내에 위치. 실제 DB 및 외부 서비스 통신을 담당합니다.

---

## 1. 블로그 메인 페이지

-   **경로**: `/blogs/[blog_id]`
-   **진척도**: `[15%] - 기본 구조만 존재`

### 기능 및 액션 체크리스트

-   [ ] **블로그 정보 및 게시글 목록 조회**
    -   **세부 구현**:
        -   `page`: `app/(blog)/blogs/[blog_id]/page.tsx`
        -   `component`: `app/(blog)/blogs/[blog_id]/_components/BlogDetail.tsx`
        -   `UI 액션`: `getBlogDataAction` (`.../[blog_id]/_actions/blog.action.ts`)
        -   `핵심 로직 (정보)`: `getBlogDetails(blogId)` (`.../_actions/get-blog-details.ts`)
        -   `핵심 로직 (글)`: `getPostsByBlog(blogId, page)` (`.../_actions/get-posts-by-blog.ts`)

---

## 2. 게시글 상세 페이지

-   **경로**: `/blogs/[blog_id]/posts/[post_id]`
-   **진척도**: `[15%] - 기본 구조만 존재`

### 기능 및 액션 체크리스트

-   [ ] **게시글 내용 조회 및 렌더링**
    -   **세부 구현**:
        -   `page`: `app/(blog)/blogs/[blog_id]/posts/[post_id]/page.tsx`
        -   `component`: `app/(blog)/blogs/[blog_id]/posts/[post_id]/_components/PostDetail.tsx`
        -   `UI 액션`: `getPostDataAction` (`.../[post_id]/_actions/post.action.ts`)
        -   `핵심 로직 파일`: `.../[post_id]/_actions/get-post-details.ts`
        -   **[TODO]** Markdown/MDX 렌더링 라이브러리 적용 필요.

---

## 3. 콘텐츠 필터링 페이지

-   **경로**: `/blogs/[blog_id]/categories/[category_id]`, `/blogs/[blog_id]/tags/[tag_id]`
-   **진척도**: `[15%] - 기본 구조만 존재`

### 기능 및 액션 체크리스트

-   [ ] **카테고리별 게시글 목록**
    -   **세부 구현**:
        -   `page`: `.../categories/[category_id]/page.tsx`
        -   `component`: `.../categories/[category_id]/_components/CategoryPosts.tsx`
        -   `UI 액션`: `getCategoryPostsAction` (`.../[category_id]/_actions/category.action.ts`)
        -   `핵심 로직 파일`: `.../[category_id]/_actions/get-posts-by-category.ts`

-   [ ] **태그별 게시글 목록**
    -   **세부 구현**:
        -   `page`: `.../tags/[tag_id]/page.tsx`
        -   `component`: `.../tags/[tag_id]/_components/TagPosts.tsx`
        -   `UI 액션`: `getTagPostsAction` (`.../[tag_id]/_actions/tag.action.ts`)
        -   `핵심 로직 파일`: `.../[tag_id]/_actions/get-posts-by-tag.ts`

---

## 4. 아카이브 및 검색

-   **경로**: `/blogs/[blog_id]/archive/**`, `/blogs/[blog_id]/search`
-   **진척도**: `[15%] - 기본 구조만 존재`

### 기능 및 액션 체크리스트

-   [ ] **날짜별 아카이브**
    -   **세부 구현**:
        -   `page`: `.../archive/[year]/[month]/page.tsx`
        -   `component`: `.../archive/[year]/[month]/_components/MonthlyArchive.tsx`
        -   `UI 액션`: `getArchivePostsAction` (`.../[month]/_actions/archive.action.ts`)
        -   `핵심 로직 파일`: `.../[month]/_actions/get-posts-by-date.ts`

-   [ ] **검색 기능**
    -   **세부 구현**:
        -   `page`: `.../search/page.tsx`
        -   `component`: `.../search/_components/SearchResults.tsx`
        -   `UI 액션`: `searchPostsAction` (`.../search/_actions/search.action.ts`)
        -   `핵심 로직 파일`: `.../search/_actions/search-posts.ts`

---

## 5. 방명록

-   **경로**: `/blogs/[blog_id]/guestbook`
-   **진척도**: `[15%] - 기본 구조만 존재`

### 기능 및 액션 체크리스트

-   [ ] **방명록 CRUD**
    -   **세부 구현**:
        -   `page`: `.../guestbook/page.tsx`
        -   `component`: `.../guestbook/_components/Guestbook.tsx`
        -   `UI 액션`: `manageGuestbookAction` (`.../guestbook/_actions/guestbook.action.ts`)
        -   `핵심 로직 파일`: `.../guestbook/_actions/crud-guestbook.ts`

