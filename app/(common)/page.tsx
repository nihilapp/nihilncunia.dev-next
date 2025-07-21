import { Home } from '@/(common)/_components';
import { setMeta } from '@/_libs';

export const metadata = setMeta({
  title: '홈',
  description: '인증 테스트 페이지',
});

export default async function HomePage() {
  return <Home />;
}
