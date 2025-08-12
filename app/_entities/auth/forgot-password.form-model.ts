import { z } from 'zod';

export const forgotPasswordFormModel = z.object({
  email: z.email('올바른 이메일을 입력해주세요'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormModel>;
