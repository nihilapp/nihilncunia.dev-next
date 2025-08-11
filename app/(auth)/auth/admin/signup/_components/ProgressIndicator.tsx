import { Progress } from '@/(common)/_components/ui/progress';

interface Props {
  step: 'initial' | 'verify';
}

export function ProgressIndicator({ step, }: Props) {
  const stepInfo = {
    initial: {
      progress: 50,
      title: '관리자 정보 입력',
      description: '관리자 계정 생성을 위한 기본 정보를 입력해주세요.',
    },
    verify: {
      progress: 100,
      title: '인증번호 확인',
      description: '슈퍼 관리자 이메일로 전송된 6자리 인증번호를 입력해주세요.',
    },
  };

  const currentStep = stepInfo[step];

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between text-sm text-muted-foreground'>
        <span>
          단계
          {' '}
          {step === 'initial'
            ? '1'
            : '2'}
          /2
        </span>
        <span>
          {currentStep.progress}
          %
        </span>
      </div>

      <Progress value={currentStep.progress} className='h-2' />

      <div className='text-center space-y-2'>
        <h2 className='text-xl font-semibold'>{currentStep.title}</h2>
        <p className='text-sm text-muted-foreground'>{currentStep.description}</p>
      </div>
    </div>
  );
}
