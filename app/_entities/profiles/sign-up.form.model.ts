import { z } from 'zod';

export const signUpModel = z.object({
  email: z
    .email('이메일 형식이 올바르지 않습니다.'),
  username: z
    .string({ message: '사용자명을 입력해주세요.', })
    .min(1, '사용자명을 입력해주세요.'),
  role: z
    .enum({
      USER: 'USER',
      ADMIN: 'ADMIN',
      SUPER_ADMIN: 'SUPER_ADMIN',
    }),
  password: z
    .string({ message: '비밀번호를 입력해주세요.', })
    .min(10, '비밀번호는 10자 이상이어야 합니다.')
    .max(128, '비밀번호는 128자 이하여야 합니다.')
    .regex(/[a-zA-Z]/, '비밀번호는 영문자를 포함해야 합니다.')
    .regex(/[0-9]/, '비밀번호는 숫자를 포함해야 합니다.')
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/, '비밀번호는 특수문자를 포함해야 합니다.'),
  passwordConfirm: z
    .string({ message: '비밀번호를 확인해주세요.', })
    .min(1, '비밀번호를 확인해주세요.'),
}).refine(
  (data) => data.password === data.passwordConfirm,
  {
    message: '비밀번호가 일치하지 않습니다.',
    path: [ 'passwordConfirm', ],
  }
);
