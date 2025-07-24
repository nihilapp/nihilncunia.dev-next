# Next.js 15 폼 구성 프롬프트

## 개요

이 프롬프트는 Next.js 15 버전의 폼 구성을 요청하는 프롬프트입니다. 필드 구조와 함께 요청하면 하기의 규칙에 의거하여 폼을 구성합니다.

## 기본 규칙

### 1. 필수 필드

- 모든 폼은 `_action` 필드를 기본적으로 포함합니다.
- 사용자가 이를 빼먹어도 자동으로 포함시킵니다.
- `_action` 필드는 요청의 구분을 위한 식별자입니다.

### 2. 폼 구성 요소

- **폼 컴포넌트**: `useActionState`를 사용한 클라이언트 컴포넌트
- **서버 액션**: 폼 제출을 처리하는 서버 함수
- **유효성 검사**: 클라이언트 및 서버 측 검증 로직
- **에러 처리**: 사용자 친화적인 에러 메시지 표시

## 파일 구조

### 폼 컴포넌트 위치

```
app/(route)/_components/
├── FormName.tsx          # 메인 폼 컴포넌트
└── ui/                   # 폼 관련 UI 컴포넌트
    ├── form.tsx
    ├── input.tsx
    ├── button.tsx
    └── ...
```

### 서버 액션 위치

```
app/_entities/[resource]/actions/
├── index.ts              # 액션 export
└── form-action.ts        # 폼 처리 서버 액션
```

## 구현 규칙

### 1. 폼 컴포넌트 작성

- `useActionState`를 사용하여 서버 액션과 상태 관리
- `useFormState`와 `useFormStatus`를 활용한 폼 상태 처리
- shadcn/ui 컴포넌트 사용 (Button, Input, Form 등)
- 반응형 디자인 적용

### 2. 서버 액션 작성

- 파일 생성 우선, 구체적인 로직은 후속 작업
- 기본적인 유효성 검사 구조 포함
- 에러 처리 및 응답 형식 정의
- 타입 안전성 보장

### 3. 타입 정의

- 폼 데이터 인터페이스 정의
- 서버 액션 응답 타입 정의
- 에러 타입 정의

## 요청 형식

사용자는 다음과 같은 형식으로 요청할 수 있습니다:

```
[폼명] 폼을 만들어주세요.
필드:
- field1: string (required)
- field2: number (optional)
- field3: select (options: option1, option2, option3)
```

## 응답 형식

프롬프트는 다음을 생성합니다:

1. **폼 컴포넌트** (`FormName.tsx`)
2. **서버 액션** (`form-action.ts`)
3. **타입 정의** (필요시)
4. **index.ts 업데이트** (export 추가)

## 예시

### 요청

```
회원가입 폼을 만들어주세요.
필드:
- email: string (required)
- password: string (required)
- confirmPassword: string (required)
- name: string (required)
- agreeToTerms: boolean (required)
```

### 생성될 파일들

- `app/(auth)/auth/signup/_components/SignUpForm.tsx`
- `app/_entities/auth/actions/signup-action.ts`
- 관련 타입 정의 및 export 업데이트

## 주의사항

1. **보안**: 비밀번호 필드는 적절한 마스킹 처리
2. **접근성**: ARIA 라벨 및 키보드 네비게이션 지원
3. **사용자 경험**: 로딩 상태, 에러 메시지, 성공 피드백 제공
4. **성능**: 불필요한 리렌더링 방지
5. **유지보수성**: 재사용 가능한 컴포넌트 구조

---

> 이 프롬프트는 Next.js 15의 최신 폼 기능을 활용하여 일관성 있고 사용자 친화적인 폼을 생성하기 위한 가이드입니다.
