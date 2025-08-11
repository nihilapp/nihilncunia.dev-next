import { AdminSignUpForm } from '@/(auth)/auth/admin/signup/_components';
import { setMeta } from '@/_libs';

export const metadata = setMeta({
  title: '관리자 회원가입',
  url: '/auth/admin/signup',
});

export default function AdminSignUpPage() {
  return <AdminSignUpForm />;
}
