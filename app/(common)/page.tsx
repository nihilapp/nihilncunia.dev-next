import { setMeta } from '@/_libs';

import { Home } from './_components/Home';

export const metadata = setMeta({
  title: `홈`,
  url: `/`,
});

export default function page() {
  return <Home />;
}
