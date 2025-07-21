# app/_entities 폴더 종합 검토 보고서

## 1. 전체 구조 분석

현재 `app/_entities` 폴더에는 3개의 엔티티가 있습니다:
- `auth/` - 인증 관련 엔티티
- `common/` - 공통 유틸리티 엔티티  
- `profiles/` - 프로필 관리 엔티티

## 2. 엔티티별 상세 분석

### 2.1 auth/ 엔티티
**완성도**: ⚠️ 부분 완성 (60%)

**구조 현황**:
- ✅ `auth.types.ts` - 완성
- ✅ `auth.api.ts` - 완성  
- ✅ `index.ts` - 완성
- ❌ `auth.store.ts` - 누락
- ❌ `auth.keys.ts` - 누락
- ❌ `hooks/` 폴더 - 누락

**문제점**:
1. **구조적 불완전성**: 표준 엔티티 구조 (store, keys, hooks)가 누락됨
2. **타입 의존성 오류**: `auth.types.ts`에서 `@/_entities/profiles/profiles.table`를 참조하지만 순환 참조 위험
3. **API 함수 누락**: React Query 훅들이 없어 실제 사용이 어려움

### 2.2 common/ 엔티티  
**완성도**: ✅ 거의 완성 (85%)

**구조 현황**:
- ✅ `common.types.ts` - 완성
- ✅ `common.store.ts` - 완성
- ✅ `common.keys.ts` - 기본 구조만 있음
- ✅ `common.api.ts` - 빈 클래스 구조만 있음
- ✅ `index.ts` - 완성
- ✅ `hooks/` 폴더 - 완성 (useLoading, useDone, use-mobile)
- ✅ `process.d.ts` - 환경변수 타입 정의 완성
- ✅ `supabase.types.ts` - Supabase 자동생성 타입 완성

**문제점**:
1. **API 클래스 미구현**: `CommonApi` 클래스가 빈 상태
2. **쿼리 키 미정의**: `commonKeys`에 실제 키가 없음
3. **타입 오류**: `googleVerfi` → `googleVerify` 오타

**강점**:
- 훅 구현이 잘 되어있음
- Zustand 스토어가 올바르게 구현됨
- 타입 정의가 포괄적임

### 2.3 profiles/ 엔티티
**완성도**: ⚠️ 심각한 문제 (40%)

**구조 현황**:
- ✅ `profiles.types.ts` - 완성
- ✅ `profiles.api.ts` - 완성
- ✅ `profiles.table.ts` - 완성
- ✅ `profiles.keys.ts` - 완성
- ✅ `index.ts` - 완성
- ❌ `profiles.store.ts` - **완전히 비어있음** (0바이트)
- ✅ `sign-in.form.model.ts` - 완성
- ✅ `sign-up.form.model.ts` - 완성 
- ❌ `hooks/` 폴더 - 누락

**심각한 문제점**:
1. **스토어 파일 빈 상태**: `profiles.store.ts`가 0바이트로 완전히 비어있음
2. **React Query 훅 누락**: CRUD 작업을 위한 훅들이 없음
3. **타입 불일치**: `sign-up.form.model.ts`에서 `name` 필드를 사용하지만 프로필 테이블에는 `username` 필드만 있음
4. **폼 모델과 API 불일치**: 폼 검증 로직과 실제 API 요구사항이 맞지 않음

## 3. 전반적인 문제점

### 3.1 구조적 문제
1. **일관성 부족**: 엔티티마다 파일 구성이 다름
2. **표준 패턴 미준수**: 프로젝트 가이드라인에 명시된 구조를 따르지 않음
3. **훅 폴더 누락**: `auth/`와 `profiles/`에 훅 폴더가 없음

### 3.2 타입 안정성 문제
1. **종속성 오류**: `@/_types` 경로 참조가 실제로는 존재하지 않음
2. **순환 참조**: auth와 profiles 간 타입 의존성
3. **필드명 불일치**: 폼 모델과 테이블 스키마 간 필드명 차이

### 3.3 구현 상태 문제
1. **미완성 파일들**: 여러 파일이 스켈레톤 코드 상태
2. **빈 파일**: `profiles.store.ts`가 완전히 비어있음
3. **TODO 표시**: 일부 파일에 구현되지 않은 부분이 명시됨

## 4. 우선순위별 수정 권장사항

### 높은 우선순위 (즉시 수정 필요)
1. **`profiles.store.ts` 복구**: 완전히 비어있는 상태 해결
2. **타입 의존성 정리**: `@/_types` 경로 문제 해결
3. **필드명 통일**: 폼 모델과 테이블 스키마 일치화

### 중간 우선순위 (단기 수정)
1. **훅 폴더 생성**: auth와 profiles에 표준 훅 구현
2. **스토어 파일 완성**: auth 엔티티 스토어 구현
3. **API 클래스 구현**: CommonApi 실제 기능 구현

### 낮은 우선순위 (중장기 개선)
1. **코드 스타일 통일**: 일관된 포매팅과 주석 스타일
2. **오타 수정**: `googleVerfi` 등 오타 정정
3. **문서화**: JSDoc 주석 추가

## 5. 권장 다음 단계

1. **긴급 복구**: `profiles.store.ts` 파일 재생성
2. **타입 시스템 정리**: 누락된 타입 정의 복구
3. **표준 구조 적용**: 모든 엔티티에 일관된 파일 구조 적용
4. **통합 테스트**: 각 엔티티 간 연동 확인

이 검토 결과를 바탕으로 우선순위에 따라 문제를 해결해 나가시기를 권장합니다.