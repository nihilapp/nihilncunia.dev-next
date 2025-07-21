'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LoadingCircle } from '@/(common)/_components';
import { Button } from '@/(common)/_components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/(common)/_components/ui/card';
import { Input } from '@/(common)/_components/ui/input';
import { Label } from '@/(common)/_components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/(common)/_components/ui/tabs';
import { useSignIn, useSignOut, useSignUp, useSession } from '@/_entities/auth';
import { useGetProfiles } from '@/_entities/profiles';
import { signInModel, signUpModel } from '@/_entities/profiles';
import { cn } from '@/_libs';

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cssVariants> {
  className?: string;
}

const cssVariants = cva(
  [ ``, ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

type SignInFormData = z.infer<typeof signInModel>;
type SignUpFormData = z.infer<typeof signUpModel>;

export function Home({ className, ...props }: Props) {
  // 인증 훅들
  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();
  const signOutMutation = useSignOut();

  // 세션 정보
  const { data: sessionData, isLoading: sessionLoading, } = useSession();
  const sessionProfile = sessionData?.result?.profile ?? null;

  // 프로필 조회 (로그인 후 테스트용)
  const { profiles, loading, } = useGetProfiles();

  // 로그인 폼
  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInModel),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 회원가입 폼
  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpModel),
    defaultValues: {
      email: '',
      username: '',
      role: 'USER',
      password: '',
      passwordConfirm: '',
    },
  });

  const handleSignIn = async (data: SignInFormData) => {
    try {
      const result = await signInMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });
      alert('로그인 성공!');
      signInForm.reset();
    }
    catch (error) {
      alert('로그인 실패: ' + (error as any)?.message || '알 수 없는 오류');
    }
  };

  const handleSignUp = async (data: SignUpFormData) => {
    try {
      await signUpMutation.mutateAsync({
        email: data.email,
        password: data.password,
        username: data.username,
        role: data.role,
      });
      alert('회원가입 성공!');
      signUpForm.reset();
    }
    catch (error) {
      alert('회원가입 실패: ' + (error as any)?.message || '알 수 없는 오류');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutMutation.mutateAsync({});
      alert('로그아웃 성공!');
    }
    catch (error) {
      alert('로그아웃 실패: ' + (error as any)?.message || '알 수 없는 오류');
    }
  };

  return (
    <div
      className={cn(
        cssVariants({}),
        className
      )}
      {...props}
    >
      <div className='container mx-auto p-8 max-w-2xl'>
        <h1 className='text-3xl font-bold mb-8 text-center'>인증 테스트 페이지</h1>

        {/* 세션 정보 표시 */}
        <Card>
          <CardHeader>
            <CardTitle>현재 세션 정보</CardTitle>
          </CardHeader>
          <CardContent>
            {sessionLoading
              ? (
                <div className='text-gray-500'>세션 정보를 불러오는 중...</div>
              )
              : sessionProfile
                ? (
                  <pre className='bg-gray-100 rounded p-3 text-xs overflow-x-auto'>
                    {JSON.stringify(sessionProfile, null, 2)}
                  </pre>
                )
                : (
                  <div className='text-gray-500'>로그인된 세션이 없습니다.</div>
                )}
          </CardContent>
        </Card>

        <div className='grid gap-8'>
          {/* 인증 폼 */}
          <Card>
            <CardHeader>
              <CardTitle>인증</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue='signin' className='w-full'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='signin'>로그인</TabsTrigger>
                  <TabsTrigger value='signup'>회원가입</TabsTrigger>
                </TabsList>

                <TabsContent value='signin' className='space-y-4'>
                  <form onSubmit={signInForm.handleSubmit(handleSignIn)} className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='signin-email'>이메일</Label>
                      <Input
                        id='signin-email'
                        type='email'
                        {...signInForm.register('email')}
                        placeholder='이메일을 입력하세요'
                        className={signInForm.formState.errors.email
                          ? 'border-red-500'
                          : ''}
                      />
                      {signInForm.formState.errors.email && (
                        <p className='text-sm text-red-500'>
                          {signInForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='signin-password'>비밀번호</Label>
                      <Input
                        id='signin-password'
                        type='password'
                        {...signInForm.register('password')}
                        placeholder='비밀번호를 입력하세요'
                        className={signInForm.formState.errors.password
                          ? 'border-red-500'
                          : ''}
                      />
                      {signInForm.formState.errors.password && (
                        <p className='text-sm text-red-500'>
                          {signInForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type='submit'
                      disabled={signInMutation.isPending}
                      className='w-full'
                    >
                      {signInMutation.isPending
                        ? '로그인 중...'
                        : '로그인'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value='signup' className='space-y-4'>
                  <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='signup-email'>이메일</Label>
                      <Input
                        id='signup-email'
                        type='email'
                        {...signUpForm.register('email')}
                        placeholder='이메일을 입력하세요'
                        className={signUpForm.formState.errors.email
                          ? 'border-red-500'
                          : ''}
                      />
                      {signUpForm.formState.errors.email && (
                        <p className='text-sm text-red-500'>
                          {signUpForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='signup-username'>사용자명</Label>
                      <Input
                        id='signup-username'
                        type='text'
                        {...signUpForm.register('username')}
                        placeholder='사용자명을 입력하세요'
                        className={signUpForm.formState.errors.username
                          ? 'border-red-500'
                          : ''}
                      />
                      {signUpForm.formState.errors.username && (
                        <p className='text-sm text-red-500'>
                          {signUpForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='signup-role'>역할</Label>
                      <select
                        id='signup-role'
                        {...signUpForm.register('role')}
                        className='w-full p-2 border rounded-md'
                      >
                        <option value='USER'>사용자</option>
                        <option value='ADMIN'>관리자</option>
                        <option value='SUPER_ADMIN'>슈퍼 관리자</option>
                      </select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='signup-password'>비밀번호</Label>
                      <Input
                        id='signup-password'
                        type='password'
                        {...signUpForm.register('password')}
                        placeholder='비밀번호를 입력하세요'
                        className={signUpForm.formState.errors.password
                          ? 'border-red-500'
                          : ''}
                      />
                      {signUpForm.formState.errors.password && (
                        <p className='text-sm text-red-500'>
                          {signUpForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='signup-password-confirm'>비밀번호 확인</Label>
                      <Input
                        id='signup-password-confirm'
                        type='password'
                        {...signUpForm.register('passwordConfirm')}
                        placeholder='비밀번호를 다시 입력하세요'
                        className={signUpForm.formState.errors.passwordConfirm
                          ? 'border-red-500'
                          : ''}
                      />
                      {signUpForm.formState.errors.passwordConfirm && (
                        <p className='text-sm text-red-500'>
                          {signUpForm.formState.errors.passwordConfirm.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type='submit'
                      disabled={signUpMutation.isPending}
                      className='w-full'
                    >
                      {signUpMutation.isPending
                        ? '회원가입 중...'
                        : '회원가입'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* 로그아웃 버튼 */}
          <Card>
            <CardHeader>
              <CardTitle>로그아웃</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleSignOut}
                disabled={signOutMutation.isPending}
                variant='destructive'
                className='w-full'
              >
                {signOutMutation.isPending
                  ? '로그아웃 중...'
                  : '로그아웃'}
              </Button>
            </CardContent>
          </Card>

          {/* 프로필 목록 (로그인 후 테스트용) */}
          <Card>
            <CardHeader>
              <CardTitle>프로필 목록 (API 테스트)</CardTitle>
            </CardHeader>
            <CardContent>
              {loading
                ? (
                  <LoadingCircle />
                )
                : (
                  <div className='space-y-2'>
                    {profiles && profiles.length > 0
                      ? (
                        profiles.map((profile) => (
                          <div
                            key={profile.profile_id}
                            className='p-3 border rounded-md'
                          >
                            <div className='font-medium'>{profile.username}</div>
                            <div className='text-sm text-gray-600'>{profile.email}</div>
                            <div className='text-xs text-gray-500'>
                              역할:
                              {profile.role}
                            </div>
                          </div>
                        ))
                      )
                      : (
                        <p className='text-gray-500'>프로필이 없습니다.</p>
                      )}
                  </div>
                )}
            </CardContent>
          </Card>

          {/* 상태 표시 */}
          <Card>
            <CardHeader>
              <CardTitle>현재 상태</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2 text-sm'>
                <div>
                  로그인 상태:
                  {signInMutation.isSuccess
                    ? '✅ 로그인됨'
                    : '❌ 로그아웃됨'}
                </div>
                <div>
                  회원가입 상태:
                  {signUpMutation.isSuccess
                    ? '✅ 완료'
                    : '❌ 미완료'}
                </div>
                <div>
                  프로필 로딩:
                  {loading
                    ? '🔄 로딩 중'
                    : '✅ 완료'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
