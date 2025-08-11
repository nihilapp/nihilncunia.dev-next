'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormInput, FormCheckbox, FormSelect, FormRadio } from '@/(common)/_components/form';
import { Button } from '@/(common)/_components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/(common)/_components/ui/form';
import { app } from '@/_libs/tools/config.loader';

const formSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  email: z.string().email('올바른 이메일을 입력해주세요'),
  interests: z.array(z.string()).min(1, '최소 1개 이상 선택해주세요'),
  category: z.string().min(1, '카테고리를 선택해주세요'),
  gender: z.string().min(1, '성별을 선택해주세요'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function Home() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      interests: [],
      category: '',
      gender: '',
      description: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('폼 데이터:', data);
    alert('폼이 제출되었습니다! 콘솔을 확인해주세요.');
  };

  return (
    <div className='container mx-auto p-8 max-w-2xl'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2'>{app.public.site.title}</h1>
        <p className='text-gray-600 mb-2'>{app.public.site.description}</p>
        <p className='text-sm text-gray-500'>
          Version:
          {' '}
          {app.public.global.version}
        </p>
      </div>

      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-2xl font-semibold mb-6'>폼 컴포넌트 테스트</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* 기본 입력 필드 */}
            <FormInput
              name='name'
              label='이름'
              placeholder='이름을 입력하세요'
            />

            <FormInput
              name='email'
              label='이메일'
              type='email'
              placeholder='이메일을 입력하세요'
            />

            {/* 멀티라인 입력 */}
            <FormInput
              name='description'
              label='설명'
              multiline
              rows={4}
              placeholder='설명을 입력하세요'
            />

            {/* 체크박스 - 2열 그리드 */}
            <FormCheckbox
              name='interests'
              label='관심사 (다중 선택) - 2열 그리드'
              data='프로그래밍|prog-Y,디자인|design-Y,음악|music-N,운동|sports-Y,요리|cooking-Y'
              optionColumns={2}
              containerClassName='border rounded-lg p-4'
            />

            {/* 체크박스 - 3열 그리드 */}
            <FormCheckbox
              name='interests3'
              label='관심사 (다중 선택) - 3열 그리드'
              data='프로그래밍|prog-Y,디자인|design-Y,음악|music-N,운동|sports-Y,요리|cooking-Y,독서|reading-Y'
              optionColumns={3}
              containerClassName='border rounded-lg p-4'
            />

            {/* 셀렉트 */}
            <FormSelect
              name='category'
              label='카테고리 (단일 선택)'
              data='기술|tech-Y,예술|art-Y,스포츠|sports-N,요리|cooking-Y'
              placeholder='카테고리를 선택하세요'
            />

            {/* 라디오 - 2열 그리드 */}
            <FormRadio
              name='gender'
              label='성별 (단일 선택) - 2열 그리드'
              data='남성|male-Y,여성|female-Y,기타|other-N'
              optionColumns={2}
              containerClassName='border rounded-lg p-4'
            />

            {/* 라디오 - 3열 그리드 */}
            <FormRadio
              name='gender3'
              label='성별 (단일 선택) - 3열 그리드'
              data='남성|male-Y,여성|female-Y,기타|other-N,선택안함|none-Y'
              optionColumns={3}
              containerClassName='border rounded-lg p-4'
            />

            {/* 에러 상태 테스트 */}
            <div className='border-t pt-6'>
              <h3 className='text-lg font-medium mb-4'>에러 상태 테스트</h3>

              <FormInput
                name='errorTest'
                label='에러 입력 필드'
                variant='error'
                placeholder='에러 상태 스타일'
              />

              <FormCheckbox
                name='errorCheckbox'
                label='에러 체크박스'
                data='옵션1|opt1-Y,옵션2|opt2-Y'
                variant='error'
              />

              <FormRadio
                name='errorRadio'
                label='에러 라디오'
                data='옵션1|opt1-Y,옵션2|opt2-Y'
                variant='error'
              />
            </div>

            <div className='flex gap-4 pt-6'>
              <Button type='submit' className='flex-1'>
                제출하기
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => form.reset()}
                className='flex-1'
              >
                초기화
              </Button>
            </div>
          </form>
        </Form>

        {/* 폼 데이터 미리보기 */}
        <div className='mt-8 p-4 bg-gray-50 rounded-lg'>
          <h3 className='text-lg font-medium mb-2'>폼 데이터 미리보기</h3>
          <pre className='text-sm text-gray-700 whitespace-pre-wrap'>
            {JSON.stringify(form.watch(), null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
