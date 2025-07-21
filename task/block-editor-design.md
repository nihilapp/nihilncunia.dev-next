# 블록 기반 에디터 설계

## 개요
노션과 유사한 블록 기반 에디터로, 다양한 블록 타입을 조합하여 풍부한 콘텐츠를 작성할 수 있는 시스템

## 블록 타입 정의

### 1. 텍스트 블록
```typescript
interface TextBlock {
  type: 'text';
  content: string;
  style: 'normal' | 'heading1' | 'heading2' | 'heading3' | 'quote' | 'code';
  alignment: 'left' | 'center' | 'right';
}
```

### 2. 컨테이너 블록
```typescript
interface ContainerBlock {
  type: 'container';
  variant: 'info' | 'warning' | 'success' | 'error' | 'note';
  title?: string;
  content: string;
  color: 'blue' | 'yellow' | 'green' | 'red' | 'gray' | 'purple';
}
```

### 3. 코드 블록
```typescript
interface CodeBlock {
  type: 'code';
  language: 'javascript' | 'typescript' | 'python' | 'html' | 'css' | 'json' | 'markdown';
  content: string;
  filename?: string;
  showLineNumbers: boolean;
}
```

### 4. 리스트 블록
```typescript
interface ListBlock {
  type: 'list';
  variant: 'bullet' | 'numbered' | 'checklist';
  items: Array<{
    content: string;
    checked?: boolean;
    children?: Array<{ content: string; checked?: boolean }>;
  }>;
}
```

### 5. 구분선 블록
```typescript
interface DividerBlock {
  type: 'divider';
  style: 'solid' | 'dashed' | 'dotted';
  color: string;
}
```

### 6. 이미지 블록 (향후 구현)
```typescript
interface ImageBlock {
  type: 'image';
  url: string;
  alt: string;
  caption?: string;
  size: 'small' | 'medium' | 'large' | 'full';
}
```

## 데이터베이스 구조

### 포스트 테이블 수정
```sql
-- 포스트 테이블에 블록 데이터 추가
posts (
  id,
  blog_id,
  title,
  content, -- JSON 형태의 블록 배열
  excerpt,
  status,
  published_at,
  created_at,
  updated_at
)
```

### 블록 데이터 예시
```json
{
  "blocks": [
    {
      "id": "block_1",
      "type": "text",
      "content": "안녕하세요!",
      "style": "heading1",
      "alignment": "left"
    },
    {
      "id": "block_2", 
      "type": "container",
      "variant": "info",
      "title": "중요한 정보",
      "content": "이것은 중요한 정보입니다.",
      "color": "blue"
    },
    {
      "id": "block_3",
      "type": "code",
      "language": "typescript",
      "content": "console.log('Hello World');",
      "filename": "example.ts",
      "showLineNumbers": true
    }
  ]
}
```

## UI/UX 설계

### 1. 블록 생성 방법
- **슬래시 명령어**: `/` 입력 시 블록 타입 선택 메뉴
- **플로팅 버튼**: 블록 사이에 마우스 호버 시 나타나는 `+` 버튼
- **키보드 단축키**: `Ctrl+Shift+1` (제목1), `Ctrl+Shift+2` (제목2) 등

### 2. 블록 편집
- **인라인 편집**: 블록 클릭 시 바로 편집 모드
- **블록 메뉴**: 블록 우클릭 또는 `...` 버튼으로 메뉴 표시
- **드래그 앤 드롭**: 블록 순서 변경

### 3. 블록 메뉴 기능
- **복제**: 블록 복사
- **삭제**: 블록 제거
- **위/아래 이동**: 키보드 화살표 또는 드래그
- **블록 타입 변경**: 다른 블록 타입으로 변환

## 구현 계획

### Phase 1: 기본 블록 시스템
1. **텍스트 블록**: 일반 텍스트, 제목, 인용구
2. **컨테이너 블록**: 색상별 박스 (info, warning, success, error)
3. **구분선 블록**: 시각적 구분

### Phase 2: 고급 블록
1. **코드 블록**: 언어별 하이라이팅
2. **리스트 블록**: 글머리 기호, 번호 매기기, 체크리스트

### Phase 3: 확장 블록
1. **이미지 블록**: Supabase Storage 연동
2. **테이블 블록**: 표 생성
3. **임베드 블록**: 외부 콘텐츠 임베드

## 기술 스택

### 프론트엔드
- **에디터 라이브러리**: `@tiptap/react` (ProseMirror 기반)
- **블록 UI**: 커스텀 React 컴포넌트
- **드래그 앤 드롭**: `@dnd-kit/core`
- **코드 하이라이팅**: `prismjs` 또는 `highlight.js`

### 백엔드
- **데이터 저장**: JSON 형태로 PostgreSQL에 저장
- **검색**: PostgreSQL Full-text Search (JSON 필드 지원)
- **API**: 블록 CRUD 엔드포인트

## 블록별 UI 컴포넌트

### 1. 텍스트 블록
```tsx
<TextBlock
  content={block.content}
  style={block.style}
  alignment={block.alignment}
  onChange={handleTextChange}
/>
```

### 2. 컨테이너 블록
```tsx
<ContainerBlock
  variant={block.variant}
  title={block.title}
  content={block.content}
  color={block.color}
  onChange={handleContainerChange}
/>
```

### 3. 코드 블록
```tsx
<CodeBlock
  language={block.language}
  content={block.content}
  filename={block.filename}
  showLineNumbers={block.showLineNumbers}
  onChange={handleCodeChange}
/>
```

## 사용자 경험

### 1. 직관적인 블록 생성
- `/` 입력 시 블록 타입 선택
- 마우스 호버 시 플로팅 버튼
- 키보드 단축키 지원

### 2. 쉬운 편집
- 클릭 한 번으로 편집 모드
- 실시간 미리보기
- 자동 저장

### 3. 블록 관리
- 드래그로 순서 변경
- 우클릭 메뉴로 빠른 액션
- 블록 타입 간 변환

## 마크다운 호환성

### 내보내기
- 블록을 마크다운으로 변환
- 코드 블록은 언어 정보 포함
- 이미지는 마크다운 링크 형태

### 가져오기
- 기존 마크다운 파일 업로드
- 자동으로 적절한 블록 타입으로 변환
- 제목 → 제목 블록, 코드 → 코드 블록

## 성능 최적화

### 1. 렌더링 최적화
- 가상화: 긴 문서에서 화면에 보이는 블록만 렌더링
- 메모이제이션: 블록 컴포넌트 메모이제이션

### 2. 저장 최적화
- 디바운싱: 타이핑 중 자동 저장 지연
- 부분 업데이트: 변경된 블록만 저장

## 결론

이 블록 기반 에디터는 노션의 장점을 가져오되, 마스터의 요구사항에 맞게 단순화했습니다. 특히 **색상별 텍스트 박스**와 **쉬운 수정**에 중점을 두어 설계했습니다.

다음 단계로는 기본 블록 타입부터 구현하여 점진적으로 확장하는 것이 좋겠습니다. 