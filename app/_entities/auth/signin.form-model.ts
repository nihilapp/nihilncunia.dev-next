import { z } from 'zod';

export const signInFormModel = z.object({
  email: z.email('올바른 이메일을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

export type SignInFormData = z.infer<typeof signInFormModel>;
