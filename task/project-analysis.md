# 멀티 블로그 플랫폼 프로젝트 분석

## 프로젝트 개요

### 핵심 개념
- **개인용 멀티 블로그 플랫폼**: 티스토리와 유사하지만 개인 전용
- **단일 사용자 시스템**: 마스터 본인만 사용하는 관리자 중심 플랫폼
- **보안 중심 설계**: 강력한 인증 시스템으로 무단 접근 차단

### 기술 스택
- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth + 커스텀 패스코드 시스템
- **Markdown**: MDX 지원 에디터

## 시스템 아키텍처

### 1. 인증 시스템 (보안 중심)
```
접근 시도 → 60자리 패스코드 검증 → Supabase Auth → profiles 테이블 조회 → OTP 검증 → 관리자 권한 부여
```

**보안 계층:**
1. **1차 방어**: robots.txt, meta 태그로 검색엔진 차단
2. **2차 방어**: 60자리 패스코드 (이메일 전송)
3. **3차 방어**: Supabase 인증
4. **4차 방어**: OTP 시스템

### 2. 데이터베이스 설계

#### 핵심 엔티티
```sql
-- Supabase Auth Users (읽기 전용)
auth.users (id, email, created_at, ...)

-- 프로필 (사용자 정보 관리)
profiles (
  profile_id (FK to auth.users.id),
  email,
  role (USER/ADMIN/SUPER_ADMIN),
  username,
  image,
  bio,
  otp_string, -- OTP 인증용
  created_at,
  updated_at
)

-- 블로그
blogs (
  id,
  profile_id (FK to profiles.profile_id),
  name,
  description,
  theme,
  settings,
  created_at,
  updated_at
)

-- 카테고리
categories (
  id,
  blog_id (FK to blogs.id),
  name,
  slug,
  parent_id (FK to categories.id),
  created_at
)

-- 태그
tags (
  id,
  blog_id (FK to blogs.id),
  name,
  slug,
  created_at
)

-- 포스트
posts (
  id,
  blog_id (FK to blogs.id),
  title,
  content (MDX),
  excerpt,
  status (DRAFT/PUBLISHED),
  published_at,
  created_at,
  updated_at
)

-- 포스트-태그 관계
post_tags (
  post_id (FK to posts.id),
  tag_id (FK to tags.id)
)

-- 댓글
comments (
  id,
  post_id (FK to posts.id),
  author,
  content,
  status (PENDING/APPROVED/REJECTED),
  created_at
)
```

### 3. 라우팅 구조

```
/                           # 메인 대시보드
├── /auth                   # 인증 관련
│   ├── /login             # 로그인
│   ├── /register          # 회원가입
│   └── /verify            # 패스코드 검증
├── /admin                  # 통합 관리자
│   ├── /blogs             # 블로그 관리
│   ├── /posts             # 포스트 관리
│   ├── /categories        # 카테고리 관리
│   ├── /tags              # 태그 관리
│   └── /settings          # 시스템 설정
└── /blogs/[blogId]        # 개별 블로그
    ├── /                  # 블로그 메인
    ├── /category/[slug]   # 카테고리별 포스트
    ├── /tag/[slug]        # 태그별 포스트
    ├── /archive           # 아카이브
    ├── /search            # 검색 결과
    ├── /post/[slug]       # 개별 포스트
    └── /admin             # 블로그별 관리자
        ├── /posts         # 포스트 관리
        ├── /comments      # 댓글 관리
        └── /settings      # 블로그 설정
```

## 개발 우선순위

### Phase 1: 기반 시스템 구축
1. **프로젝트 초기 설정**
   - Next.js 14 + TypeScript 설정
   - TailwindCSS + shadcn/ui 설정
   - Prisma + PostgreSQL 설정
   - Supabase 연동

2. **데이터베이스 스키마 설계**
   - 핵심 테이블 생성
   - 관계 설정
   - 마이그레이션 파일 작성

3. **인증 시스템 구현**
   - Supabase Auth 설정
   - profiles 테이블 연동
   - 패스코드 시스템 구현
   - OTP 시스템 구현 (profiles.otp_string 활용)
   - 보안 미들웨어 구현

### Phase 2: 관리자 기능
1. **통합 관리자 페이지**
   - 대시보드 UI
   - 블로그 CRUD
   - 카테고리/태그 관리
   - 시스템 설정

2. **포스트 관리 시스템**
   - 마크다운 에디터 구현
   - 포스트 CRUD
   - 미리보기 기능

### Phase 3: 블로그 프론트엔드
1. **개별 블로그 페이지**
   - 블로그 메인 페이지
   - 포스트 상세 페이지
   - 카테고리/태그 페이지
   - 검색 기능

2. **블로그별 관리자**
   - 포스트 관리
   - 댓글 관리
   - 블로그 설정

### Phase 4: 고도화
1. **SEO 최적화**
2. **성능 최적화**
3. **추가 기능 (아카이브, RSS 등)**

## 핵심 기능 상세

### 1. 마크다운 에디터
- **라이브러리**: `@uiw/react-md-editor` 또는 커스텀 구현
- **기능**:
  - 실시간 미리보기
  - 툴바 버튼 (굵게, 기울임, 링크 등)
  - 이미지 업로드
  - 코드 하이라이팅
  - 자동 저장

### 2. 다중 블로그 관리
- **소유권 관리**: profiles.profile_id를 통한 블로그 소유자 식별
- **테마 시스템**: 각 블로그별 다른 디자인 적용
- **설정 분리**: 블로그별 독립적인 설정
- **콘텐츠 격리**: 블로그간 데이터 완전 분리

### 3. 검색 시스템
- **전문 검색**: PostgreSQL Full-text Search 활용
- **필터링**: 카테고리, 태그, 날짜별 필터
- **실시간 검색**: 디바운싱 적용

## 보안 고려사항

### 1. 접근 제어
- 모든 관리자 페이지에 인증 미들웨어 적용
- 세션 관리 및 자동 로그아웃
- API 엔드포인트 보호

### 2. 데이터 보호
- 민감 정보 암호화
- SQL 인젝션 방지
- XSS 방지

### 3. 운영 보안
- 로그 모니터링
- 백업 시스템
- 에러 핸들링

## 성능 최적화 전략

### 1. 프론트엔드
- Next.js App Router 활용
- 이미지 최적화
- 코드 스플리팅
- 캐싱 전략

### 2. 백엔드
- API 응답 캐싱
- 데이터베이스 인덱싱
- 쿼리 최적화

## 개발 환경 설정

### 1. 개발 도구
- ESLint + Prettier
- Husky (Git hooks)
- TypeScript strict mode
- 환경변수 관리

### 2. 배포 환경
- Vercel (프론트엔드)
- Supabase (데이터베이스 + 인증)
- 도메인 설정

## 마일스톤

### Week 1-2: 기반 구축
- 프로젝트 설정 완료
- 데이터베이스 스키마 완성
- 기본 인증 시스템 구현

### Week 3-4: 관리자 기능
- 통합 관리자 페이지 완성
- 마크다운 에디터 구현
- 기본 CRUD 기능 완성

### Week 5-6: 블로그 프론트엔드
- 개별 블로그 페이지 구현
- 검색 기능 구현
- 반응형 디자인 적용

### Week 7-8: 고도화 및 배포
- SEO 최적화
- 성능 최적화
- 배포 및 테스트

## 결론

이 프로젝트는 개인용 멀티 블로그 플랫폼으로, 보안과 사용성을 모두 고려한 설계가 필요합니다. 단일 사용자 시스템이므로 복잡한 권한 관리 대신 강력한 인증 시스템에 집중하고, 블로그 관리의 편의성을 최우선으로 하는 것이 핵심입니다.

다음 단계로는 구체적인 데이터베이스 스키마 설계와 API 엔드포인트 설계를 진행하는 것이 좋겠습니다.

## 추가 고려사항

### Supabase Auth 연동
- `auth.users`는 Supabase에서 관리되므로 직접 수정 불가
- `profiles` 테이블을 통해 사용자 정보 확장
- Auth 트리거를 통한 자동 프로필 생성 고려
- RLS(Row Level Security) 정책 설정 필요

### 데이터베이스 설계 원칙
- 모든 테이블에 `created_at`, `updated_at` 타임스탬프 포함
- UUID를 기본 키로 사용하여 보안 강화
- 외래 키 관계를 통한 데이터 무결성 보장
- 블로그별 데이터 격리를 위한 `blog_id` 필수 포함 