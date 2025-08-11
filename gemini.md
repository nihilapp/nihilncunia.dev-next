# Gemini Development Guide

이 문서는 프로젝트의 일관성, 유지보수성, 협업 효율을 높이기 위한 개발 가이드입니다. 모든 개발자는 이 규칙을 숙지하고 준수해야 합니다.

---

## 1. 공통 개발 규칙

- **언어**: 모든 응답, 주석, 에러 메시지는 한국어로 작성합니다.
- **패키지 매니저**: 모든 패키지 관련 명령어는 `pnpm`을 사용합니다.
- **코드 스타일**: 가독성을 위해 구문과 구문 사이에 한 줄의 공백을 둡니다.
- **파일 이름**:
    - 일반 파일 및 폴더: `kebab-case` (예: `post-list.ts`, `user-profile`)
    - React 컴포넌트: `PascalCase` (예: `PostCard.tsx`)
- **Export**: `export * from ...` 사용을 금지하고, `export { ... } from '...'` 형식으로 명시적으로 내보냅니다.
- **태스크 처리**: 여러 태스크가 요청된 경우, 확인 없이 순차적으로 진행합니다.

---

## 2. 프로젝트 구조

### 2.1. 기본 폴더 구조

- **라우트 그룹**: `app/(common)`, `app/(auth)`, `app/(admin)`으로 역할을 분리합니다.
- **공통 폴더**:
    - `app/_components`: 공통 UI 컴포넌트 (내부에 `ui`, `form` 등 세분화)
    - `app/_layouts`: 공통 레이아웃 컴포넌트
    - `app/_entities`: 도메인별 엔티티(데이터, 로직, 상태) 관리
    - `app/_libs`: 공통 라이브러리 및 헬퍼 (`tools` 포함)
    - `app/_icons`: 커스텀 아이콘
    - `app/_data`: 정적 데이터 (메시지, 설정 등)
- **라우트별 폴더**: 각 라우트 폴더(`app/posts` 등) 내에 해당 라우트에서만 사용하는 `_components`, `_layouts`를 둘 수 있습니다.
- **`index.ts`**: 각 폴더에는 `index.ts` 파일을 두어 내부 모듈을 명시적으로 export 합니다.

### 2.2. 엔티티(`_entities`) 폴더 구조

각 엔티티는 도메인별로 파일을 분리하여 관리합니다.

```
_entities/[entity명]/
├── index.ts                    # 엔티티의 모든 export 관리
├── [entity명].api.ts           # API 호출 함수 (클라이언트 사이드)
├── [entity명].service.ts       # 비즈니스 로직 및 DB 작업 (서버 사이드)
├── [entity명].store.ts         # 클라이언트 상태 관리 (Zustand)
├── [entity명].keys.ts          # React Query 쿼리 키
├── [entity명].types.ts         # TypeScript 타입 정의
├── [entity명].form-model.ts    # 폼 유효성 검사 스키마 (Zod)
└── hooks/
    ├── index.ts
    └── use[Action][Entity].ts  # React Query 커스텀 훅
```

---

## 3. UI 컴포넌트 및 페이지 개발

### 3.1. 페이지 (`page.tsx`)

- **서버 컴포넌트**: `page.tsx`는 서버 컴포넌트로 유지하고, `use client`를 사용하지 않습니다.
- **메타데이터**: `setMeta` 유틸을 사용하여 `title`, `url`을 포함한 `metadata`를 항상 작성합니다. 동적 페이지는 `generateMetadata` 함수를 사용합니다.
- **구조**: 페이지의 실제 UI 렌더링은 `_components` 폴더의 클라이언트 컴포넌트에 위임합니다.

### 3.2. UI 컴포넌트

- **UI 라이브러리**: `shadcn/ui`를 기본으로 사용하며, 컴포넌트는 `app/(common)/_components/ui`에 위치합니다.
- **스타일링**: `class-variance-authority` (CVA)와 `TailwindCSS`를 사용하여 스타일을 정의합니다.
- **Props**: `className`과 나머지 HTML 속성을 받을 수 있도록 `React.HTMLAttributes<HTMLElement>`를 확장하여 Props 인터페이스를 정의합니다.

### 예시: 페이지와 컴포넌트 분리

```typescript
// page.tsx (서버 컴포넌트)
import { SignInForm } from "./_components";
import { setMeta } from "@/_libs";

export const metadata = setMeta({
  title: "로그인",
  url: "/auth/signin",
});

export default function SignInPage() {
  return <SignInForm />;
}

// _components/SignInForm.tsx (클라이언트 컴포넌트)
"use client";
import { cva } from 'class-variance-authority';

interface Props extends React.FormHTMLAttributes<HTMLFormElement> {
  className?: string;
}

export function SignInForm({ className, ...props }: Props) {
  // ... 컴포넌트 로직
}
```

---

## 4. 데이터 관리 (React Query & Zod)

### 4.1. React Query

- **API 함수 분리**: `queryFn`과 `mutationFn`에 들어갈 API 호출 함수는 `[entity명].api.ts`에 별도로 작성합니다.
- **훅 네이밍**: GET 요청은 `useGet...`, 뮤테이션은 `useCreate...`, `useUpdate...`, `useDelete...`로 시작합니다.
- **훅 구조 (GET)**: `useQuery`를 사용하며, `useLoading`, `useDone` 훅으로 로딩 상태를 관리합니다. `{ data, loading, done, ...other }` 구조로 반환합니다.
- **훅 구조 (Mutation)**: `useMutation`을 사용하며, `onSuccess` 콜백에서 `queryClient.invalidateQueries`로 관련 쿼리를 무효화합니다.
- **쿼리 키**: `[entity명].keys.ts` 파일에서 중앙 관리하며, `all`, `lists`, `details` 등으로 구조화합니다.
- **옵션 전달**: 모든 훅은 `QueryOptionType` 또는 `MutationOptionsType`을 통해 React Query의 기본 옵션을 커스터마이징할 수 있도록 `...options`를 전달해야 합니다.

### 4.2. 폼 관리 (Zod)

- **스키마 위치**: `[entity명].form-model.ts` 파일에 `zod` 스키마와 `infer`를 사용한 타입을 함께 정의합니다.
- **이메일 유효성 검사**: `z.string().email()`이 아닌 `z.email()`을 사용합니다.

### 예시: Zod 폼 모델

```typescript
// auth.form-model.ts
import { z } from "zod";

export const signInFormModel = z.object({
  email: z.email("올바른 이메일을 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export type SignInFormData = z.infer<typeof signInFormModel>;
```

---

## 5. API 및 백엔드 개발

### 5.1. API 라우트 (`/app/api/...`)

- **파일**: API 엔드포인트는 `route.ts` 파일로 작성합니다.
- **응답**: `successResponse`와 `errorResponse` 헬퍼를 사용하여 일관된 응답 구조를 유지합니다.
- **에러 처리**: 모든 핸들러는 `try-catch`로 감싸고, `Logger`로 에러를 기록합니다. HTTP 상태 코드는 규칙에 맞게 사용합니다 (400, 401, 404, 409, 500 등).

### 5.2. 서비스 레이어 (`.service.ts`)

- **역할**: 데이터베이스 접근, 비즈니스 로직 처리를 담당합니다. API 라우트는 서비스를 호출하는 역할만 수행합니다.
- **Prisma**: `PrismaHelper.client`를 통해 Prisma 클라이언트에 접근합니다.

### 5.3. 데이터베이스 (Prisma Schema)

- **모델**: 모델명은 `PascalCase`, 테이블명(`@@map`)은 `snake_case` 복수형을 사용합니다.
- **컬럼**: 컬럼명은 `snake_case`를 사용합니다.
- **ID**: 모든 테이블의 ID는 `String` 타입의 `uuid`를 사용합니다.
- **관계**: 관계 설정 시 `onDelete: Cascade`를 적용하여 데이터 무결성을 유지합니다.

### 5.4. 보안

- **비밀번호**: `BcryptHelper`를 사용하여 비밀번호를 해싱(`dataToHash`)하고 비교(`dataCompare`)합니다.
- **권한 확인**: 민감한 작업을 수행하기 전에 반드시 사용자 권한을 확인합니다.
- **정보 노출**: 응답 데이터에서 비밀번호 해시, 리프레시 토큰 등 민감한 정보를 제외합니다.

---

## 6. 공통 유틸리티 (`@/_libs/tools`)

- **Api (`axios.tools.ts`)**: HTTP 요청 처리
- **BcryptHelper (`bcrypt.tools.ts`)**: 비밀번호 해싱
- **CommonHelper (`common.tools.ts`)**: 범용 유틸리티 (UUID, 배열/객체 처리 등)
- **CookieHelper (`cookie.tools.ts`)**: 서버 사이드 쿠키 관리
- **DateHelper (`date.tools.ts`)**: 날짜/시간 처리 (Luxon 기반)
- **JwtHelper (`jwt.tools.ts`)**: JWT 생성 및 검증
- **Logger (`logger.tools.ts`)**: 구조화된 로깅
- **PrismaHelper (`prisma.tools.ts`)**: Prisma 클라이언트 및 관련 DB 작업

각 헬퍼는 필요한 곳에서 개별적으로 import하여 사용합니다.
