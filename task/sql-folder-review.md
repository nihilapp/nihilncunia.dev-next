# app/_sql 폴더 데이터베이스 파일 검토 보고서

## 1. 전체 구조 개요

### 폴더 구조
```
app/_sql/
├── migrations/           # Drizzle ORM 마이그레이션 파일들
│   ├── 0000_cloudy_prowler.sql
│   ├── 0001_strong_dexter_bennett.sql
│   ├── 0002_cloudy_sumo.sql
│   └── meta/            # 마이그레이션 메타데이터
│       ├── _journal.json
│       ├── 0000_snapshot.json
│       ├── 0001_snapshot.json
│       └── 0002_snapshot.json
├── triggers/            # SQL 트리거 정의
│   └── create_profile_trigger.sql
├── views/               # SQL 뷰 정의
│   └── get_profiles.sql (비어있음)
└── grant_table_permissions.sql  # 권한 설정
```

## 2. 마이그레이션 파일 분석

### 2.1 마이그레이션 히스토리 (_journal.json)
**구현 완성도: ✅ 완료**
- Drizzle ORM v7 사용
- PostgreSQL 방언 설정
- 3개의 마이그레이션 기록 (2025년 1월 실행)
- breakpoints 활성화로 안전한 마이그레이션 보장

### 2.2 마이그레이션 파일들

#### 0000_cloudy_prowler.sql
**구현 완성도: ✅ 완료**
**정확성: ✅ 정확**
- `profile_role` ENUM 타입 생성 (USER, ADMIN, SUPER_ADMIN)
- `profiles` 테이블 초기 생성
- Supabase auth.users와의 외래키 관계 설정
- 적절한 제약조건 (UNIQUE 제약조건, DEFAULT 값)

#### 0001_strong_dexter_bennett.sql  
**구현 완성도: ✅ 완료**
**정확성: ✅ 정확**
- 컬럼명 snake_case로 변경 (camelCase → snake_case)
- 외래키 제약조건 재설정
- 일관된 명명 규칙 적용

#### 0002_cloudy_sumo.sql
**구현 완성도: ⚠️ 문제 있음**
**정확성: ❌ 심각한 문제**

**주요 문제점:**
1. **PRIMARY KEY 누락**: `profile_id` 컬럼이 PRIMARY KEY가 아님
2. **테이블 재생성**: DROP 후 CREATE로 데이터 손실 위험
3. **스키마 불일치**: 스냅샷과 실제 마이그레이션 파일 간 불일치

### 2.3 스냅샷 파일 분석

#### 0002_snapshot.json의 치명적 문제
```json
"profile_id": {
  "name": "profile_id",
  "type": "uuid",
  "primaryKey": false,  // ❌ PRIMARY KEY가 아님!
  "notNull": false      // ❌ NOT NULL이 아님!
}
```

**데이터 무결성 문제:**
- 테이블에 PRIMARY KEY가 없어 중복 레코드 가능
- profile_id가 NULL 허용으로 참조 무결성 위반 가능

## 3. 스키마 정의 분석 (profiles.table.ts)

**구현 완성도: ⚠️ 부분적 완료**
**정확성: ⚠️ 문제 있음**

### 문제점:
1. **PRIMARY KEY 누락**: `profile_id`에 `primaryKey()` 누락
2. **NOT NULL 제약조건 누락**: `profile_id`에 `notNull()` 누락
3. **마이그레이션과 불일치**: 스키마 정의와 실제 마이그레이션 결과 불일치

### 올바른 스키마 정의:
```typescript
profile_id: uuid().primaryKey().notNull().references(() => usersTable.id),
```

## 4. 트리거 분석 (create_profile_trigger.sql)

**구현 완성도: ⚠️ 부분적 완료**
**정확성: ⚠️ 문제 있음**

### 장점:
- Supabase Auth 통합 로직 구현
- SECURITY DEFINER로 보안 고려
- 조건부 트리거 생성으로 중복 방지
- 적절한 권한 설정

### 문제점:
1. **SQL 구문 오류**: 19번째 줄 trailing comma
```sql
role,  -- ❌ 마지막 컬럼 뒤 콤마
```

2. **에러 처리 부족**: INSERT 실패 시 처리 로직 없음
3. **로깅 부족**: 디버깅을 위한 로그 없음

## 5. 뷰 분석 (get_profiles.sql)

**구현 완성도: ❌ 미완료**
**정확성: ❌ 구현되지 않음**

- 파일이 완전히 비어있음
- 프로필 조회를 위한 뷰 구현 필요

## 6. 권한 설정 분석 (grant_table_permissions.sql)

**구현 완성도: ✅ 완료**
**정확성: ⚠️ 부분적 문제**

### 장점:
- authenticated, service_role에 적절한 권한 부여
- 스키마 사용 권한 포함

### 개선 필요사항:
1. **RLS 정책 없음**: Row Level Security 미구현
2. **세분화된 권한 부족**: ALL 권한 대신 필요한 권한만 부여 권장

## 7. 보안 및 성능 분석

### 보안 문제:
1. **RLS 미적용**: 모든 스냅샷에서 `"isRLSEnabled": false`
2. **과도한 권한**: ALL 권한 부여로 보안 위험
3. **PRIMARY KEY 누락**: 데이터 무결성 위험

### 성능 문제:
1. **인덱스 부족**: 자주 조회되는 컬럼 (email, username) 추가 인덱스 없음
2. **외래키 인덱스 부족**: profile_id 컬럼 인덱스 없음

## 8. 권장 수정사항

### 즉시 수정 필요 (Critical):
1. **PRIMARY KEY 추가**: profile_id를 PRIMARY KEY로 설정
2. **트리거 구문 오류 수정**: trailing comma 제거
3. **스키마 정의 수정**: profiles.table.ts 파일 수정

### 개선 권장사항:
1. **RLS 정책 구현**: 사용자별 데이터 접근 제어
2. **뷰 구현**: get_profiles.sql 구현
3. **인덱스 추가**: 성능 최적화
4. **에러 처리 강화**: 트리거 함수 개선
5. **권한 세분화**: 필요한 권한만 부여

### 추가 마이그레이션 필요:
```sql
-- 0003_fix_primary_key.sql
ALTER TABLE profiles ADD PRIMARY KEY (profile_id);
ALTER TABLE profiles ALTER COLUMN profile_id SET NOT NULL;
```

## 9. 전체 평가

**전체 구현 완성도: 70%**
**데이터 무결성: ❌ 심각한 문제**
**보안 수준: ⚠️ 개선 필요**
**성능 최적화: ⚠️ 개선 필요**

**결론**: 기본 구조는 양호하나 PRIMARY KEY 누락과 같은 치명적 문제가 있어 즉시 수정이 필요합니다.