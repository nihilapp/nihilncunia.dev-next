import { z } from 'zod';

export const resetPasswordFormModel = z.object({
  email: z.email('올바른 이메일을 입력해주세요'),
  tempPassword: z.string().min(1, '임시 비밀번호를 입력해주세요'),
  newPassword: z.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, '비밀번호는 영대소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다'),
  confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: [ 'confirmPassword', ],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordFormModel>;
