import { z } from 'zod';

export const adminSignUpFormModel = z.object({
  email: z.email('올바른 이메일을 입력해주세요.'),
  username: z.string()
    .min(2, '이름은 2자 이상이어야 합니다.')
    .max(20, '이름은 20자 이하이어야 합니다.'),
  password: z.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .max(20, '비밀번호는 20자 이하이어야 합니다.')
    .regex(/^(?=.*[a-z])/, '비밀번호는 영문 소문자를 포함해야 합니다.')
    .regex(/^(?=.*[A-Z])/, '비밀번호는 영문 대문자를 포함해야 합니다.')
    .regex(/^(?=.*\d)/, '비밀번호는 숫자를 포함해야 합니다.')
    .regex(/^(?=.*[@$!%*?&])/, '비밀번호는 특수문자(@$!%*?&)를 포함해야 합니다.'),
  role: z.literal('ADMIN'),
});

export const verificationCodeModel = z.object({
  code: z.string().length(6, '인증번호는 6자리여야 합니다.'),
});

export type AdminSignUpFormData = z.infer<typeof adminSignUpFormModel>;
export type VerificationCodeData = z.infer<typeof verificationCodeModel>;
