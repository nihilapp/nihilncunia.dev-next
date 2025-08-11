'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/(common)/_components/form';
import { Button } from '@/(common)/_components/ui/button';
import { Form } from '@/(common)/_components/ui/form';
import { verificationCodeModel } from '@/_entities/auth';
import type { VerificationCodeData } from '@/_entities/auth';

interface Props {
  onSubmit: (data: VerificationCodeData) => void;
  onBack: () => void;
  isPending: boolean;
}

export function VerificationStep({ onSubmit, onBack, isPending, }: Props) {
  const codeForm = useForm<VerificationCodeData>({
    resolver: zodResolver(verificationCodeModel),
    defaultValues: { code: '', },
  });

  return (
    <Form {...codeForm}>
      <form
        onSubmit={codeForm.handleSubmit(onSubmit)}
        className='space-y-6'
      >
        <FormInput
          form={codeForm}
          name='code'
          label='인증번호'
          placeholder='6자리 숫자 입력'
        />

        <div className='space-y-3'>
          <Button
            type='submit'
            className='w-full h-12'
            disabled={isPending}
          >
            {isPending
              ? '인증 및 가입 처리중...'
              : '인증 및 가입'}
          </Button>

          <Button
            type='button'
            variant='outline'
            className='w-full h-10'
            onClick={onBack}
            disabled={isPending}
          >
            이전 단계로 돌아가기
          </Button>
        </div>
      </form>
    </Form>
  );
}
