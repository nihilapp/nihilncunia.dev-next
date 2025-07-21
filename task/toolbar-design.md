# 블록 기반 에디터 툴바 설계

## 툴바 구조

### 1. 블록 단위 툴바 (상단)
```
[제목1] [제목2] [제목3] | [인용구] [코드] | [색상박스] [구분선] | [글머리기호] [번호매기기] [체크리스트]
```

### 2. 인라인 단위 툴바 (하단)
```
[굵게] [기울임] [밑줄] [취소선] | [링크] [이미지] | [왼쪽] [가운데] [오른쪽] | [색상] [배경색]
```

## 툴바 배치 전략

### 1. 위치 기반 구분
```
┌─────────────────────────────────────────────────────────┐
│ 블록 단위 툴바 (상단 고정)                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 에디터 영역                                              │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ 인라인 단위 툴바 (선택 시 표시)                          │
└─────────────────────────────────────────────────────────┘
```

### 2. 컨텍스트 기반 표시
- **블록 툴바**: 항상 상단에 고정 표시
- **인라인 툴바**: 텍스트 선택 시 하단에 표시
- **블록별 툴바**: 특정 블록 선택 시 해당 블록 옆에 표시

## 블록 단위 툴바 상세

### 텍스트 스타일 그룹
```typescript
const textStyleButtons = [
  { icon: 'H1', label: '제목1', action: 'heading1', shortcut: 'Ctrl+Shift+1' },
  { icon: 'H2', label: '제목2', action: 'heading2', shortcut: 'Ctrl+Shift+2' },
  { icon: 'H3', label: '제목3', action: 'heading3', shortcut: 'Ctrl+Shift+3' },
  { icon: '¶', label: '본문', action: 'paragraph', shortcut: 'Ctrl+Shift+0' },
];
```

### 특수 블록 그룹
```typescript
const specialBlockButtons = [
  { icon: '💬', label: '인용구', action: 'quote', shortcut: 'Ctrl+Shift+Q' },
  { icon: '</>', label: '코드', action: 'code', shortcut: 'Ctrl+Shift+C' },
  { icon: '📝', label: '색상박스', action: 'container', shortcut: 'Ctrl+Shift+B' },
  { icon: '─', label: '구분선', action: 'divider', shortcut: 'Ctrl+Shift+D' },
];
```

### 리스트 그룹
```typescript
const listButtons = [
  { icon: '•', label: '글머리기호', action: 'bulletList', shortcut: 'Ctrl+Shift+L' },
  { icon: '1.', label: '번호매기기', action: 'numberedList', shortcut: 'Ctrl+Shift+O' },
  { icon: '☐', label: '체크리스트', action: 'checklist', shortcut: 'Ctrl+Shift+T' },
];
```

## 인라인 단위 툴바 상세

### 텍스트 서식 그룹
```typescript
const textFormatButtons = [
  { icon: 'B', label: '굵게', action: 'bold', shortcut: 'Ctrl+B' },
  { icon: 'I', label: '기울임', action: 'italic', shortcut: 'Ctrl+I' },
  { icon: 'U', label: '밑줄', action: 'underline', shortcut: 'Ctrl+U' },
  { icon: 'S', label: '취소선', action: 'strikethrough', shortcut: 'Ctrl+Shift+S' },
];
```

### 링크/미디어 그룹
```typescript
const linkMediaButtons = [
  { icon: '🔗', label: '링크', action: 'link', shortcut: 'Ctrl+K' },
  { icon: '🖼️', label: '이미지', action: 'image', shortcut: 'Ctrl+Shift+I' },
];
```

### 정렬 그룹
```typescript
const alignmentButtons = [
  { icon: '⫷', label: '왼쪽', action: 'alignLeft', shortcut: 'Ctrl+Shift+L' },
  { icon: '⫸', label: '가운데', action: 'alignCenter', shortcut: 'Ctrl+Shift+E' },
  { icon: '⫹', label: '오른쪽', action: 'alignRight', shortcut: 'Ctrl+Shift+R' },
];
```

### 색상 그룹
```typescript
const colorButtons = [
  { icon: '🎨', label: '텍스트 색상', action: 'textColor', type: 'colorPicker' },
  { icon: '🖌️', label: '배경 색상', action: 'backgroundColor', type: 'colorPicker' },
];
```

## 툴바 컴포넌트 구조

### 1. 메인 툴바 컴포넌트
```tsx
interface ToolbarProps {
  selectedBlock: Block | null;
  selectedText: string | null;
  onBlockAction: (action: string) => void;
  onInlineAction: (action: string, value?: any) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedBlock,
  selectedText,
  onBlockAction,
  onInlineAction
}) => {
  return (
    <div className="toolbar-container">
      {/* 블록 단위 툴바 */}
      <BlockToolbar 
        selectedBlock={selectedBlock}
        onAction={onBlockAction}
      />
      
      {/* 인라인 단위 툴바 */}
      {selectedText && (
        <InlineToolbar 
          selectedText={selectedText}
          onAction={onInlineAction}
        />
      )}
    </div>
  );
};
```

### 2. 블록 툴바 컴포넌트
```tsx
const BlockToolbar: React.FC<BlockToolbarProps> = ({ selectedBlock, onAction }) => {
  return (
    <div className="block-toolbar">
      {/* 텍스트 스타일 그룹 */}
      <ToolbarGroup>
        {textStyleButtons.map(button => (
          <ToolbarButton
            key={button.action}
            icon={button.icon}
            label={button.label}
            shortcut={button.shortcut}
            isActive={selectedBlock?.style === button.action}
            onClick={() => onAction(button.action)}
          />
        ))}
      </ToolbarGroup>
      
      <ToolbarSeparator />
      
      {/* 특수 블록 그룹 */}
      <ToolbarGroup>
        {specialBlockButtons.map(button => (
          <ToolbarButton
            key={button.action}
            icon={button.icon}
            label={button.label}
            shortcut={button.shortcut}
            onClick={() => onAction(button.action)}
          />
        ))}
      </ToolbarGroup>
      
      <ToolbarSeparator />
      
      {/* 리스트 그룹 */}
      <ToolbarGroup>
        {listButtons.map(button => (
          <ToolbarButton
            key={button.action}
            icon={button.icon}
            label={button.label}
            shortcut={button.shortcut}
            isActive={selectedBlock?.type === button.action}
            onClick={() => onAction(button.action)}
          />
        ))}
      </ToolbarGroup>
    </div>
  );
};
```

### 3. 인라인 툴바 컴포넌트
```tsx
const InlineToolbar: React.FC<InlineToolbarProps> = ({ selectedText, onAction }) => {
  return (
    <div className="inline-toolbar">
      {/* 텍스트 서식 그룹 */}
      <ToolbarGroup>
        {textFormatButtons.map(button => (
          <ToolbarButton
            key={button.action}
            icon={button.icon}
            label={button.label}
            shortcut={button.shortcut}
            onClick={() => onAction(button.action)}
          />
        ))}
      </ToolbarGroup>
      
      <ToolbarSeparator />
      
      {/* 링크/미디어 그룹 */}
      <ToolbarGroup>
        {linkMediaButtons.map(button => (
          <ToolbarButton
            key={button.action}
            icon={button.icon}
            label={button.label}
            shortcut={button.shortcut}
            onClick={() => onAction(button.action)}
          />
        ))}
      </ToolbarGroup>
      
      <ToolbarSeparator />
      
      {/* 정렬 그룹 */}
      <ToolbarGroup>
        {alignmentButtons.map(button => (
          <ToolbarButton
            key={button.action}
            icon={button.icon}
            label={button.label}
            shortcut={button.shortcut}
            onClick={() => onAction(button.action)}
          />
        ))}
      </ToolbarGroup>
      
      <ToolbarSeparator />
      
      {/* 색상 그룹 */}
      <ToolbarGroup>
        {colorButtons.map(button => (
          <ColorPickerButton
            key={button.action}
            icon={button.icon}
            label={button.label}
            onColorChange={(color) => onAction(button.action, color)}
          />
        ))}
      </ToolbarGroup>
    </div>
  );
};
```

## 색상박스 전용 툴바

### 컨테이너 블록 선택 시 표시
```tsx
const ContainerToolbar: React.FC<ContainerToolbarProps> = ({ block, onUpdate }) => {
  const colorOptions = [
    { value: 'blue', label: '파란색', color: '#3B82F6' },
    { value: 'yellow', label: '노란색', color: '#F59E0B' },
    { value: 'green', label: '초록색', color: '#10B981' },
    { value: 'red', label: '빨간색', color: '#EF4444' },
    { value: 'gray', label: '회색', color: '#6B7280' },
    { value: 'purple', label: '보라색', color: '#8B5CF6' },
  ];

  return (
    <div className="container-toolbar">
      <ToolbarGroup>
        <span>색상:</span>
        {colorOptions.map(option => (
          <ColorButton
            key={option.value}
            color={option.color}
            isActive={block.color === option.value}
            onClick={() => onUpdate({ ...block, color: option.value })}
          />
        ))}
      </ToolbarGroup>
      
      <ToolbarSeparator />
      
      <ToolbarGroup>
        <span>타입:</span>
        <Select
          value={block.variant}
          onChange={(value) => onUpdate({ ...block, variant: value })}
          options={[
            { value: 'info', label: '정보' },
            { value: 'warning', label: '경고' },
            { value: 'success', label: '성공' },
            { value: 'error', label: '오류' },
            { value: 'note', label: '참고' },
          ]}
        />
      </ToolbarGroup>
    </div>
  );
};
```

## 사용자 경험

### 1. 직관적인 구분
- **블록 단위**: 문서 구조를 변경하는 기능
- **인라인 단위**: 선택된 텍스트의 스타일을 변경하는 기능

### 2. 컨텍스트 인식
- 선택된 블록에 따라 관련 버튼 활성화
- 텍스트 선택 시에만 인라인 툴바 표시
- 특수 블록 선택 시 전용 툴바 표시

### 3. 키보드 단축키
- 모든 버튼에 단축키 표시
- 툴팁으로 단축키 안내
- 사용자 정의 단축키 설정 가능

## 스타일링

### 1. 툴바 디자인
```css
.toolbar-container {
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  padding: 8px 16px;
}

.block-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbar-separator {
  width: 1px;
  height: 24px;
  background: #d1d5db;
  margin: 0 8px;
}
```

### 2. 버튼 스타일
```css
.toolbar-button {
  padding: 6px 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-button:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.toolbar-button.active {
  background: #3b82f6;
  color: white;
  border-color: #2563eb;
}
```

## 결론

이 툴바 설계는 블록 단위와 인라인 단위를 명확히 구분하여 사용자가 직관적으로 기능을 이해할 수 있도록 했습니다. 특히 색상박스 기능은 전용 툴바를 통해 쉽게 색상과 타입을 변경할 수 있도록 설계했습니다.

다음 단계로는 실제 툴바 컴포넌트를 구현하여 블록 에디터와 연동하는 것이 좋겠습니다. 