# 하이브리드 관리자 회원가입 시스템 구현 계획

## 1. 개요

기존의 회원가입 시스템에서 발견된 권한 상승 취약점을 해결하기 위해, 개발 환경과 운영 환경을 구분하는 하이브리드 방식의 관리자 회원가입 시스템을 도입한다.

-   **개발 환경**: `/auth/admin/signup` 경로에서 즉시 관리자 계정 생성을 허용한다.
-   **운영 환경**: `/auth/admin/signup` 경로에서 폼 제출 시, 설정된 슈퍼 관리자 이메일로 6자리 인증번호를 발송하고, 해당 번호를 인증해야만 관리자 계정 생성이 완료된다.

## 2. 시스템 구현을 위한 분석

### 2.1. 신규 프론트엔드 컴포넌트

-   **관리자 회원가입 페이지 (`/app/(auth)/auth/admin/signup/page.tsx`)**
    -   새로운 페이지 라우트. 서버 컴포넌트로 메타데이터 설정 및 클라이언트 컴포넌트 렌더링.

-   **관리자 회원가입 폼 (`/app/(auth)/auth/admin/signup/_components/AdminSignUpForm.tsx`)**
    -   `'use client'` 컴포넌트.
    -   **상태 관리**: '정보 입력'(`initial`)과 '인증번호 입력'(`verify`)의 두 단계로 나누어 UI/로직 관리.
    -   **UI**: 초기 폼(이메일, 이름, 비밀번호)과 인증 폼(6자리 코드)으로 구성.

### 2.2. 신규 백엔드 API 엔드포인트

-   **관리자 회원가입 API (`/app/api/auth/admin/signup/route.ts`)**
    -   `POST` 요청 처리.
    -   `verificationCode` 유무로 1단계(인증 요청)와 2단계(인증 및 가입) 로직 분기.
    -   **1단계**: 개발 환경에서는 즉시 가입, 운영 환경에서는 인증번호 생성 및 이메일 발송.
    -   **2단계**: 운영 환경에서 인증번호 검증 후 가입 처리.

### 2.3. 기존 로직 수정 및 신규 로직 추가

-   **`AuthService` (`app/_entities/auth/auth.service.ts`)**
    -   `signUpAdmin(data, verificationCode?)` 신규 메서드 추가.
    -   인증번호 생성, 해싱, 저장, 검증 로직 추가.
    -   **인증 이력 관리**: 인증 성공 시, 레코드를 삭제하는 대신 `code_hash`를 `null`로 업데이트하고 `verified_at` 타임스탬프를 기록하여 이력을 남긴다.

-   **이메일 유틸리티 (`app/_libs/tools/email.tools.ts`)**
    -   `Resend` 라이브러리를 사용한 이메일 발송 헬퍼.
    -   `sendVerificationCode(to, code)`와 같은 메서드 포함.

-   **Prisma 스키마 (`prisma/schema.prisma`)**
    -   `admin_verify_histories` 모델을 추가하여 인증 시도 이력을 관리. 인증번호 해시, 만료 시간, 인증 성공 여부 등을 저장.

### 2.4. 환경설정

-   **슈퍼 관리자 이메일 (`private.config.json`)**: 인증번호를 수신할 이메일 주소 설정.
-   **이메일 서비스 키 (`private.config.json`)**: `resend`의 `api_key`와 `from` 주소 설정.

### 2.5. 신규 라이브러리

-   **`resend`**: 이메일 발송 라이브러리.

## 3. 전체 작업 흐름

### A. 개발 환경 (`NODE_ENV === 'development'`)

1.  사용자가 `/auth/admin/signup` 페이지에서 정보를 입력하고 제출.
2.  API는 개발 환경임을 인지하고 즉시 `role: 'ADMIN'`으로 사용자 생성.
3.  성공 응답 후 리디렉션.

### B. 운영 환경 (`NODE_ENV === 'production'`)

1.  사용자가 `/auth/admin/signup` 페이지에서 정보를 입력하고 제출.
2.  API는 운영 환경임을 인지하고, 6자리 인증번호를 생성하여 해싱 후 `admin_verify_histories` 테이블에 **새 이력 레코드**를 생성하고, 슈퍼 관리자 이메일로 발송.
3.  프론트엔드는 UI를 '인증번호 입력' 단계로 전환.
4.  사용자(슈퍼 관리자)가 이메일로 받은 코드를 입력하고 제출.
5.  API는 코드를 검증하고, 성공 시 `role: 'ADMIN'`으로 사용자를 생성.
6.  사용한 이력 레코드의 `code_hash`를 **null로 업데이트**하고 `verified_at` 시간을 기록하여 인증이 완료되었음을 표시.
7.  성공 응답을 반환하고, 사용자는 리디렉션.

---

## 4. 구현 To-Do 리스트

### **1. 환경설정 및 라이브러리 설치**
-   [ ] `pnpm add resend` 명령어로 이메일 발송 라이브러리 설치
-   [ ] `private.config.example.json` 파일에 `resend` 및 `admin` 설정 구조 추가

### **2. 데이터베이스 스키마 수정**
-   [ ] `prisma/schema.prisma` 파일에 인증 이력 저장을 위한 `admin_verify_histories` 모델 추가
-   [ ] `pnpm prisma migrate dev --name add_admin_verify_histories` 명령어로 마이그레이션 실행

### **3. 백엔드 로직 구현**
-   [ ] **이메일 유틸리티 생성 (`app/_libs/tools/email.tools.ts`)**
    -   [ ] `Resend` 클라이언트를 초기화하는 로직 작성
    -   [ ] `sendVerificationCode(to, code)` 함수 구현
-   [ ] **`AuthService` 확장 (`app/_entities/auth/auth.service.ts`)**
    -   [ ] `createAdminVerification` 메서드 구현 (인증 이력 레코드 생성)
    -   [ ] `verifyAdminCode` 메서드 구현 (인증번호 검증 및 이력 업데이트)
    -   [ ] `signUpAdmin` 메서드 구현 (하이브리드 로직: 개발/운영 분기 처리)
-   [ ] **신규 API 엔드포인트 생성 (`app/api/auth/admin/signup/route.ts`)**
    -   [ ] `POST` 핸들러 구현
    -   [ ] 요청에 `verificationCode` 유무에 따라 `AuthService`의 다른 로직 호출

### **4. 프론트엔드 UI 및 로직 구현**
-   [ ] **신규 페이지 라우트 생성 (`app/(auth)/auth/admin/signup/page.tsx`)**
    -   [ ] `setMeta`를 사용하여 페이지 메타데이터 설정
    -   [ ] `AdminSignUpForm` 컴포넌트 렌더링
-   [ ] **신규 폼 컴포넌트 생성 (`app/(auth)/auth/admin/signup/_components/AdminSignUpForm.tsx`)**
    -   [ ] `zod`를 사용하여 관리자 회원가입 폼 스키마(`adminSignUpFormModel`) 정의
    -   [ ] `react-hook-form`으로 폼 상태 관리
    -   [ ] **UI 상태 관리**: '정보 입력'(`initial`) 단계와 '인증번호 입력'(`verify`) 단계를 전환하는 로직 구현
    -   [ ] **API 연동**:
        -   1단계: 폼 데이터로 관리자 회원가입 API 호출
        -   2단계: 인증번호를 포함하여 동일 API 재호출
    -   [ ] 로딩 및 에러 메시지 처리

### **5. 라우팅 및 네비게이션**
-   [ ] 기존 로그인/회원가입 페이지에 관리자 회원가입 페이지로 이동하는 링크 추가 (필요 시)