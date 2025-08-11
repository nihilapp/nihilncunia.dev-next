import { z } from 'zod';

export const signUpFormModel = z.object({
  email: z.string().email('이메일 형식이 올바르지 않습니다.'),
  username: z.string()
    .min(2, '필명은 2자 이상이어야 합니다.')
    .max(20, '필명은 20자 이하이어야 합니다.'),
  password: z.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .max(20, '비밀번호는 20자 이하이어야 합니다.')
    .regex(/^(?=.*[a-z])/, '비밀번호는 영문 소문자를 포함해야 합니다.')
    .regex(/^(?=.*[A-Z])/, '비밀번호는 영문 대문자를 포함해야 합니다.')
    .regex(/^(?=.*\d)/, '비밀번호는 숫자를 포함해야 합니다.')
    .regex(/^(?=.*[@$!%*?&])/, '비밀번호는 특수문자(@$!%*?&)를 포함해야 합니다.'),
  passwordConfirm: z.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .max(20, '비밀번호는 20자 이하이어야 합니다.')
    .regex(/^(?=.*[a-z])/, '비밀번호는 영문 소문자를 포함해야 합니다.')
    .regex(/^(?=.*[A-Z])/, '비밀번호는 영문 대문자를 포함해야 합니다.')
    .regex(/^(?=.*\d)/, '비밀번호는 숫자를 포함해야 합니다.')
    .regex(/^(?=.*[@$!%*?&])/, '비밀번호는 특수문자(@$!%*?&)를 포함해야 합니다.'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: [ 'passwordConfirm', ],
});

export type SignUpFormData = z.infer<typeof signUpFormModel>;
