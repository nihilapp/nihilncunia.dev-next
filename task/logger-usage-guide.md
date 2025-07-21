# Logger 사용 가이드

Logger 헬퍼는 애플리케이션 전반에서 일관된 로깅을 제공하는 유틸리티입니다. 구조화된 로그 메시지와 컨텍스트 정보를 통해 디버깅과 모니터링을 효율적으로 할 수 있습니다.

## 기본 사용법

### Import

```typescript
import { Logger } from '@/_libs';
```

## API 로깅

### 1. API 요청 시작/성공/실패

```typescript
// API 라우트에서 사용 예시
export async function POST(req: NextRequest) {
  const { email, username, role } = await req.json();
  
  // 요청 시작 로그
  Logger.apiRequest('POST', '/api/auth/signup', { email, username, role });
  
  try {
    // ... API 로직 ...
    
    // 성공 로그
    Logger.apiSuccess('POST', '/api/auth/signup', { email, username });
    
    return response;
  } catch (error) {
    // 실패 로그
    Logger.apiError('POST', '/api/auth/signup', '예상치 못한 오류', { 
      email, 
      error: error.message 
    });
    
    return errorResponse;
  }
}
```

**출력 예시:**
```
[2025-01-21T10:30:15.123Z] [INFO] [API] POST /api/auth/signup 요청 시작 { email: "user@example.com", username: "testuser", role: "USER" }
[2025-01-21T10:30:15.456Z] [INFO] [API] POST /api/auth/signup 요청 성공 { email: "user@example.com", username: "testuser" }
```

## 인증 로깅

### 2. 인증 관련 로그

```typescript
// 인증 성공
Logger.auth('사용자 로그인 성공', { 
  userId: '123', 
  email: 'user@example.com',
  provider: 'email' 
});

// 인증 실패
Logger.authError('비밀번호 불일치', { 
  email: 'user@example.com',
  attemptCount: 3 
});

// 권한 관련
Logger.auth('관리자 권한 확인', { 
  userId: '123', 
  requiredRole: 'ADMIN',
  userRole: 'USER' 
});
```

**출력 예시:**
```
[2025-01-21T10:30:15.789Z] [INFO] [AUTH] 사용자 로그인 성공 { userId: "123", email: "user@example.com", provider: "email" }
[2025-01-21T10:30:16.123Z] [ERROR] [AUTH] 비밀번호 불일치 { email: "user@example.com", attemptCount: 3 }
```

## 데이터베이스 로깅

### 3. 데이터베이스 작업

```typescript
// 데이터베이스 작업 성공
Logger.database('프로필 생성 완료', { 
  profileId: 'uuid-123',
  email: 'user@example.com' 
});

// 데이터베이스 에러
Logger.databaseError('프로필 조회 실패', { 
  email: 'user@example.com',
  error: 'Connection timeout',
  query: 'SELECT * FROM profiles WHERE email = ?'
});

// 복잡한 쿼리 로깅
Logger.database('벌크 업데이트 실행', {
  table: 'profiles',
  affectedRows: 150,
  duration: '2.3s'
});
```

**출력 예시:**
```
[2025-01-21T10:30:17.456Z] [INFO] [DB] 프로필 생성 완료 { profileId: "uuid-123", email: "user@example.com" }
[2025-01-21T10:30:17.789Z] [ERROR] [DB] 프로필 조회 실패 { email: "user@example.com", error: "Connection timeout", query: "SELECT * FROM profiles WHERE email = ?" }
```

## 사용자 액션 로깅

### 4. 사용자 행동 추적

```typescript
// 사용자 액션 (로그인된 사용자)
Logger.userAction('프로필 업데이트', 'user-123', {
  updatedFields: ['username', 'bio'],
  previousValues: { username: 'oldname', bio: 'old bio' }
});

// 사용자 액션 (익명 사용자)
Logger.userAction('회원가입 시도', undefined, {
  email: 'user@example.com',
  provider: 'email'
});

// 관리자 액션
Logger.userAction('사용자 권한 변경', 'admin-456', {
  targetUserId: 'user-123',
  previousRole: 'USER',
  newRole: 'ADMIN'
});
```

**출력 예시:**
```
[2025-01-21T10:30:18.123Z] [INFO] [USER] 사용자 액션: 프로필 업데이트 { userId: "user-123", updatedFields: ["username", "bio"], previousValues: { username: "oldname", bio: "old bio" } }
```

## 보안 로깅

### 5. 보안 관련 이벤트

```typescript
// 의심스러운 활동
Logger.security('비정상적인 로그인 시도 감지', {
  email: 'user@example.com',
  ipAddress: '192.168.1.100',
  attemptCount: 10,
  timeWindow: '5분'
});

// 권한 위반
Logger.security('무권한 API 접근 시도', {
  userId: 'user-123',
  requestedEndpoint: '/api/admin/users',
  userRole: 'USER',
  requiredRole: 'ADMIN'
});

// 데이터 유출 위험
Logger.security('대량 데이터 요청 감지', {
  userId: 'user-123',
  requestedRecords: 10000,
  endpoint: '/api/profiles'
});
```

**출력 예시:**
```
[2025-01-21T10:30:19.456Z] [WARN] [SECURITY] 비정상적인 로그인 시도 감지 { email: "user@example.com", ipAddress: "192.168.1.100", attemptCount: 10, timeWindow: "5분" }
```

## 일반 로깅

### 6. 범용 로깅 메서드

```typescript
// 정보 로그
Logger.info('PAYMENT', '결제 처리 시작', {
  orderId: 'order-123',
  amount: 50000,
  paymentMethod: 'credit_card'
});

// 경고 로그
Logger.warn('PERFORMANCE', 'API 응답 시간 초과', {
  endpoint: '/api/profiles',
  responseTime: '5.2s',
  threshold: '3s'
});

// 에러 로그
Logger.error('EMAIL', '이메일 발송 실패', {
  recipient: 'user@example.com',
  template: 'welcome',
  error: 'SMTP connection failed'
});

// 디버그 로그 (개발 환경에서만 출력)
Logger.debug('CACHE', '캐시 히트', {
  key: 'user:profile:123',
  ttl: 3600,
  hitRate: '85%'
});
```

**출력 예시:**
```
[2025-01-21T10:30:20.789Z] [INFO] [PAYMENT] 결제 처리 시작 { orderId: "order-123", amount: 50000, paymentMethod: "credit_card" }
[2025-01-21T10:30:21.123Z] [WARN] [PERFORMANCE] API 응답 시간 초과 { endpoint: "/api/profiles", responseTime: "5.2s", threshold: "3s" }
```

## 고급 사용법

### 7. 복잡한 컨텍스트 정보

```typescript
// 요청 트레이싱
const requestId = 'req-' + Date.now();
const userId = 'user-123';

Logger.apiRequest('GET', '/api/profiles', { 
  requestId, 
  userId,
  userAgent: req.headers['user-agent'],
  clientIp: getClientIP(req)
});

// 에러 스택 포함
try {
  // 위험한 작업
} catch (error) {
  Logger.error('CRITICAL', '시스템 에러 발생', {
    errorName: error.name,
    errorMessage: error.message,
    errorStack: error.stack,
    requestId,
    timestamp: new Date().toISOString()
  });
}

// 성능 측정
const startTime = Date.now();
// ... 작업 수행 ...
const duration = Date.now() - startTime;

Logger.info('PERFORMANCE', '작업 완료', {
  operation: 'bulk_profile_update',
  duration: `${duration}ms`,
  recordsProcessed: 1000,
  averageTimePerRecord: `${duration/1000}ms`
});
```

### 8. 조건부 로깅

```typescript
// 환경별 로깅
if (process.env.NODE_ENV === 'production') {
  Logger.info('SYSTEM', '프로덕션 환경에서 시작됨', {
    version: process.env.APP_VERSION,
    buildDate: process.env.BUILD_DATE
  });
}

// 디버그 모드에서만
if (process.env.DEBUG === 'true') {
  Logger.debug('SYSTEM', '디버그 정보', {
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  });
}

// 에러 레벨에 따른 분기
const errorLevel = getErrorSeverity(error);
if (errorLevel === 'critical') {
  Logger.error('SYSTEM', '크리티컬 에러', { error, requestId });
} else {
  Logger.warn('SYSTEM', '일반 에러', { error, requestId });
}
```

## 로그 포맷

모든 로그는 다음과 같은 일관된 포맷으로 출력됩니다:

```
[타임스탬프] [레벨] [카테고리] 메시지 컨텍스트_객체
```

**예시:**
```
[2025-01-21T10:30:15.123Z] [INFO] [API] POST /api/auth/signup 요청 시작 { email: "user@example.com", username: "testuser" }
```

## 주의사항

### 1. 민감한 정보 로깅 금지
```typescript
// ❌ 잘못된 예시 - 비밀번호 로깅
Logger.auth('로그인 시도', { 
  email: 'user@example.com',
  password: 'secret123'  // 절대 금지!
});

// ✅ 올바른 예시
Logger.auth('로그인 시도', { 
  email: 'user@example.com',
  hasPassword: true  // 존재 여부만 표시
});
```

### 2. 과도한 로깅 방지
```typescript
// ❌ 반복문 내 과도한 로깅
users.forEach(user => {
  Logger.info('USER', '사용자 처리 중', { userId: user.id });  // 너무 많은 로그
});

// ✅ 배치 처리 로깅
Logger.info('USER', '사용자 배치 처리 시작', { 
  totalUsers: users.length,
  batchSize: 100 
});
// ... 처리 로직 ...
Logger.info('USER', '사용자 배치 처리 완료', { 
  processedUsers: users.length,
  duration: `${duration}ms` 
});
```

### 3. 개발 환경 전용 로깅
```typescript
// debug() 메서드는 개발 환경에서만 출력됨
Logger.debug('CACHE', '캐시 상태 확인', {
  hitRate: cacheStats.hitRate,
  missCount: cacheStats.missCount
});
```

이 Logger를 활용하여 애플리케이션의 모든 중요한 이벤트를 체계적으로 기록하고 모니터링할 수 있습니다.