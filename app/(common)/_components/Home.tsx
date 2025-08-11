'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { useSession, useSignOut } from '@/_entities/auth';
import { cn } from '@/_libs';
import { ToastHelper } from '@/_libs/tools/toast.tools';

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cssVariants> {
  className?: string;
}

const cssVariants = cva(
  [ 'p-8 space-y-6', ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

export function Home({ className, ...props }: Props) {
  const router = useRouter();
  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const { sessionUser, refetch, isAuthenticated, } = useSession();
  const signOutMutation = useSignOut();

  const handleGetSession = async () => {
    setIsLoading(true);
    try {
      await refetch();
      ToastHelper.success('세션 정보를 새로고침했습니다.');
    }
    catch (error) {
      ToastHelper.error('세션 정보 가져오기에 실패했습니다.');
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutMutation.mutateAsync();
      ToastHelper.success('로그아웃되었습니다.');
      router.push('/');
    }
    catch (error) {
      ToastHelper.error('로그아웃에 실패했습니다.');
    }
  };

  const handleRefreshToken = async () => {
    setIsLoading(true);
    try {
      // 세션을 다시 가져와서 토큰을 갱신
      await refetch();
      ToastHelper.success('토큰이 갱신되었습니다.');
    }
    catch (error) {
      ToastHelper.error('토큰 갱신에 실패했습니다.');
    }
    finally {
      setIsLoading(false);
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
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-center mb-8'>
          🏠 NIHILNCUNIA.DEV - 개발 테스트 페이지
        </h1>

        {/* 현재 세션 상태 */}
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              🔐 현재 세션 상태
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessionUser
              ? (
                <div className='space-y-2'>
                  <p>
                    <strong>이메일:</strong>
                    {' '}
                    {sessionUser.email}
                  </p>
                  <p>
                    <strong>사용자명:</strong>
                    {' '}
                    {sessionUser.username}
                  </p>
                  <p>
                    <strong>역할:</strong>
                    {' '}
                    {sessionUser.role}
                  </p>
                  <p>
                    <strong>ID:</strong>
                    {' '}
                    {sessionUser.id}
                  </p>
                </div>
              )
              : (
                <p className='text-muted-foreground'>로그인되지 않음</p>
              )}
          </CardContent>
        </Card>

        {/* 개발 테스트 링크들 */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {/* 인증 관련 */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-blue-800'>
                🔑 인증 테스트
              </CardTitle>
              <CardDescription>
                로그인, 회원가입, 어드민 회원가입 페이지로 이동
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              {isAuthenticated
                ? (
                  <Button
                    className='w-full cursor-not-allowed opacity-50'
                    variant='outline'
                    disabled
                  >
                    로그인 페이지
                  </Button>
                )
                : (
                  <Button
                    asChild
                    className='w-full cursor-pointer'
                    variant='default'
                  >
                    <Link href='/auth/signin'>
                      로그인 페이지
                    </Link>
                  </Button>
                )}
              {isAuthenticated
                ? (
                  <Button
                    className='w-full cursor-not-allowed opacity-50'
                    variant='outline'
                    disabled
                  >
                    회원가입 페이지
                  </Button>
                )
                : (
                  <Button
                    asChild
                    className='w-full cursor-pointer'
                    variant='default'
                  >
                    <Link href='/auth/signup'>
                      회원가입 페이지
                    </Link>
                  </Button>
                )}
              {isAuthenticated
                ? (
                  <Button
                    className='w-full cursor-not-allowed opacity-50'
                    variant='outline'
                    disabled
                  >
                    어드민 회원가입
                  </Button>
                )
                : (
                  <Button
                    asChild
                    className='w-full cursor-pointer'
                    variant='default'
                  >
                    <Link href='/auth/admin/signup'>
                      어드민 회원가입
                    </Link>
                  </Button>
                )}
            </CardContent>
          </Card>

          {/* 어드민 페이지 */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-purple-800'>
                👑 어드민 페이지
              </CardTitle>
              <CardDescription>
                어드민 전용 페이지들로 이동
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              {!isAuthenticated || sessionUser?.role !== 'ADMIN'
                ? (
                  <Button
                    className='w-full cursor-not-allowed opacity-50'
                    variant='outline'
                    disabled
                  >
                    어드민 대시보드
                  </Button>
                )
                : (
                  <Button
                    asChild
                    className='w-full cursor-pointer'
                    variant='default'
                  >
                    <Link href='/admin'>
                      어드민 대시보드
                    </Link>
                  </Button>
                )}
              {!isAuthenticated || sessionUser?.role !== 'ADMIN'
                ? (
                  <Button
                    className='w-full cursor-not-allowed opacity-50'
                    variant='outline'
                    disabled
                  >
                    사용자 관리
                  </Button>
                )
                : (
                  <Button
                    asChild
                    className='w-full cursor-pointer'
                    variant='default'
                  >
                    <Link href='/admin/users'>
                      사용자 관리
                    </Link>
                  </Button>
                )}
              {!isAuthenticated || sessionUser?.role !== 'ADMIN'
                ? (
                  <Button
                    className='w-full cursor-not-allowed opacity-50'
                    variant='outline'
                    disabled
                  >
                    포스트 관리
                  </Button>
                )
                : (
                  <Button
                    asChild
                    className='w-full cursor-pointer'
                    variant='default'
                  >
                    <Link href='/admin/posts'>
                      포스트 관리
                    </Link>
                  </Button>
                )}
            </CardContent>
          </Card>

          {/* 세션 관리 */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-green-800'>
                📊 세션 관리
              </CardTitle>
              <CardDescription>
                세션 정보 새로고침 및 토큰 갱신
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              {!isAuthenticated
                ? (
                  <Button
                    className='w-full cursor-not-allowed opacity-50'
                    variant='outline'
                    disabled
                  >
                    세션 새로고침
                  </Button>
                )
                : (
                  <Button
                    onClick={handleGetSession}
                    disabled={isLoading}
                    className='w-full cursor-pointer'
                    variant='default'
                  >
                    {isLoading
                      ? '로딩 중...'
                      : '세션 새로고침'}
                  </Button>
                )}
              {!isAuthenticated
                ? (
                  <Button
                    className='w-full cursor-not-allowed opacity-50'
                    variant='outline'
                    disabled
                  >
                    토큰 재발급
                  </Button>
                )
                : (
                  <Button
                    onClick={handleRefreshToken}
                    disabled={isLoading}
                    className='w-full cursor-pointer'
                    variant='default'
                  >
                    {isLoading
                      ? '로딩 중...'
                      : '토큰 재발급'}
                  </Button>
                )}
            </CardContent>
          </Card>

          {/* 로그아웃 */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-red-800'>
                🚪 로그아웃
              </CardTitle>
              <CardDescription>
                현재 세션 종료
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleSignOut}
                disabled={!isAuthenticated || signOutMutation.isPending}
                className='w-full cursor-pointer'
                variant='destructive'
              >
                {signOutMutation.isPending
                  ? '로그아웃 중...'
                  : !isAuthenticated
                    ? '로그인 필요'
                    : '로그아웃'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 개발 정보 */}
        <Card className='mt-8'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              ℹ️ 개발 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              이 페이지는 개발 중에 인증 시스템을 테스트하기 위한 페이지입니다.
              로그인 상태, 세션 관리, 토큰 갱신 등을 확인할 수 있습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
