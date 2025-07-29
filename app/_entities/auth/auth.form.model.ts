import { z } from 'zod';

// 로그인 스키마
export const signInSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

// 회원가입 스키마
export const signUpSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
  confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
  username: z.string().min(1, '사용자명을 입력해주세요.'),
  role: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: [ 'confirmPassword', ],
});

// OTP 검증 스키마
export const otpSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
  otpCode: z.string().regex(/^\d{6}$/, 'OTP 코드는 6자리 숫자여야 합니다.'),
});

// 패스코드 검증 스키마
export const passcodeSchema = z.object({ passCode: z.string().min(1, '패스코드를 입력해주세요.'), });

// 비밀번호 재설정 요청 스키마
export const forgotPasswordSchema = z.object({ email: z.string().email('올바른 이메일 형식을 입력해주세요.'), });

// 새 비밀번호 설정 스키마
export const newPasswordSchema = z.object({
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
  confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
  resetToken: z.string().min(1, '재설정 토큰이 필요합니다.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: [ 'confirmPassword', ],
});

// 타입 추출
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type PasscodeFormData = z.infer<typeof passcodeSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;
